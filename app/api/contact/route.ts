import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { site } from "@/lib/site";
import { contactSchema, type ContactData, type ContactResponse } from "@/lib/validations";

const MAX_BODY_BYTES = 10_000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

// Límite por IP en memoria: alcanza para frenar abusos simples en un único
// servidor. En serverless con varias instancias conviene un store externo.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT.max;
}

function originHost(origin: string): string | null {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

function isHoneypotFilled(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null || !("website" in payload)) return false;
  return typeof payload.website === "string" && payload.website.trim() !== "";
}

function reply(body: ContactResponse, status: number) {
  return NextResponse.json(body, { status });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmail({ name, email, phone, message }: ContactData) {
  const rows: [string, string][] = [
    ["Nombre", name],
    ["Email", email],
    ["Teléfono", phone || "—"],
  ];

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Mensaje:", message].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1A1A1A;max-width:560px">
      <h2 style="font-family:Georgia,serif;font-weight:normal;color:#0E5C5C">Nueva consulta desde el sitio web</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 0;color:#666;width:110px;border-bottom:1px solid #DDD8CD">${k}</td><td style="padding:8px 0;border-bottom:1px solid #DDD8CD">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:24px 0 8px;color:#666;font-size:14px">Mensaje</p>
      <p style="white-space:pre-wrap;font-size:15px;line-height:1.6;margin:0">${escapeHtml(message)}</p>
    </div>`;

  return { text, html };
}

export async function POST(request: NextRequest) {
  // Solo aceptamos envíos desde el propio sitio.
  const origin = request.headers.get("origin");
  if (origin && originHost(origin) !== request.headers.get("host")) {
    return reply({ ok: false, error: "Origen no permitido." }, 403);
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return reply({ ok: false, error: "La consulta es demasiado extensa." }, 413);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return reply(
      { ok: false, error: "Recibimos varias consultas seguidas. Intente nuevamente en unos minutos." },
      429,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return reply({ ok: false, error: "Solicitud inválida." }, 400);
  }

  // Honeypot completo: respondemos OK sin enviar nada para no dar pistas.
  if (isHoneypotFilled(payload)) return reply({ ok: true }, 200);

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return reply(
      {
        ok: false,
        error: "Revise los datos del formulario.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      400,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? site.contact.email;

  if (!apiKey || !from) {
    console.error("[contact] Falta configurar RESEND_API_KEY o CONTACT_FROM_EMAIL.");
    return reply(
      { ok: false, error: "El envío no está disponible en este momento." },
      503,
    );
  }

  const { name, email } = parsed.data;
  const { text, html } = buildEmail(parsed.data);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Consulta web — ${name}`,
      text,
      html,
    });

    if (error) {
      console.error("[contact] Resend rechazó el envío:", error);
      return reply({ ok: false, error: "No pudimos enviar su consulta." }, 502);
    }
  } catch (error) {
    console.error("[contact] Error inesperado al enviar:", error);
    return reply({ ok: false, error: "No pudimos enviar su consulta." }, 502);
  }

  return reply({ ok: true }, 200);
}
