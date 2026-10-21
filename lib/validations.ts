import { z } from "zod";

export const MESSAGE_MAX = 2000;

/**
 * Esquema del formulario de contacto. Se usa en el cliente (react-hook-form)
 * y se vuelve a validar en el servidor (/api/contact).
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingrese su nombre completo.")
    .max(80, "El nombre no puede superar los 80 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "Ingrese su email.")
    .pipe(z.email("Ingrese un email válido, por ejemplo nombre@empresa.com.")),
  phone: z
    .string()
    .trim()
    .max(30, "El teléfono no puede superar los 30 caracteres.")
    .refine((value) => value === "" || /^[+()\d\s-]{6,}$/.test(value), {
      error: "Ingrese un teléfono válido: solo números, espacios, guiones o +.",
    }),
  message: z
    .string()
    .trim()
    .min(20, "Cuéntenos un poco más: al menos 20 caracteres.")
    .max(MESSAGE_MAX, `El mensaje no puede superar los ${MESSAGE_MAX} caracteres.`),
  /** Trampa anti-spam: los humanos no ven este campo y lo dejan vacío. */
  website: z.string().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactData, string[]>> };
