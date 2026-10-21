"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { useForm, useWatch } from "react-hook-form";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EASE } from "@/lib/motion";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  contactSchema,
  MESSAGE_MAX,
  type ContactData,
  type ContactInput,
  type ContactResponse,
} from "@/lib/validations";

type Status =
  | { state: "idle" }
  | { state: "success"; name: string }
  | { state: "error"; message: string };

type FieldName = "name" | "email" | "phone" | "message";

const DEFAULTS: ContactInput = { name: "", email: "", phone: "", message: "", website: "" };

/** Ids estables de los campos (hay un único formulario en la página). */
const FIELD_ID: Record<FieldName, string> = {
  name: "carta-nombre",
  message: "carta-mensaje",
  email: "carta-email",
  phone: "carta-telefono",
};
const FIELD_ORDER: readonly FieldName[] = ["name", "message", "email", "phone"];

const errorId = (field: FieldName) => `${FIELD_ID[field]}-error`;

// Entrada de la carta: los bloques aparecen en cascada al llegar a la vista.
// Con movimiento reducido, MotionConfig deja sólo el fundido de opacidad.
const FORM_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.6, ease: EASE } },
};

const BLOCK_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Formulario de contacto presentado como una carta con espacios a completar.
 * Cada campo tiene su etiqueta para lectores de pantalla y los errores se
 * resumen debajo, enlazados a su campo.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const refocusRef = useRef(false);

  const form = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULTS,
    mode: "onTouched",
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const message = useWatch({ control, name: "message" }) ?? "";
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(),
      ),
    [],
  );

  const fieldError = (field: FieldName) => errors[field]?.message;
  const invalidFields = FIELD_ORDER.filter((field) => fieldError(field));

  const onSubmit = async (data: ContactData) => {
    setStatus({ state: "idle" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as ContactResponse;

      if (result.ok) {
        setStatus({ state: "success", name: data.name.split(" ")[0] ?? data.name });
        reset(DEFAULTS);
        return;
      }

      // Errores de validación devueltos por el servidor.
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        if (messages?.[0]) setError(field as keyof ContactInput, { message: messages[0] });
      }
      setStatus({ state: "error", message: result.error });
    } catch {
      setStatus({ state: "error", message: "No pudimos conectar con el servidor." });
    }
  };

  const blankProps = (field: FieldName) => ({
    id: FIELD_ID[field],
    "aria-invalid": Boolean(fieldError(field)),
    "aria-describedby": fieldError(field) ? errorId(field) : undefined,
  });

  return (
    // Sin tarjeta propia: el formulario se apoya en la mitad off-white del
    // panel partido de Contacto, que pone fondo y márgenes.
    <div className="relative">
      <AnimatePresence mode="wait">
        {status.state === "success" ? (
          <SuccessMessage
            key="success"
            name={status.name}
            onReset={() => {
              refocusRef.current = true;
              setStatus({ state: "idle" });
            }}
          />
        ) : (
          <motion.form
            key="form"
            variants={FORM_VARIANTS}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            onAnimationComplete={() => {
              // Al volver desde "Enviar otra consulta", el foco va al primer campo.
              if (!refocusRef.current) return;
              refocusRef.current = false;
              setFocus("name");
            }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Carta de consulta"
            aria-describedby="contacto-form-nota"
            className="grid gap-7"
          >
            {/* Membrete de la carta */}
            <motion.div
              variants={BLOCK_VARIANTS}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4 text-eyebrow uppercase text-stone"
            >
              <span className="text-gold-deep">Consulta · {site.name}</span>
              <span>Rosario, {today}</span>
            </motion.div>

            <motion.div variants={BLOCK_VARIANTS} className="font-serif text-display-sm leading-[2.2] text-ink">
              <p>Señores {site.shortName}:</p>
              <p className="mt-3">
                Mi nombre es{" "}
                <Blank
                  {...blankProps("name")}
                  {...register("name")}
                  label="Nombre y apellido"
                  autoComplete="name"
                  placeholder="nombre y apellido"
                  className="sm:w-[15ch]"
                />{" "}
                y les escribo por lo siguiente:
              </p>
            </motion.div>

            <motion.div variants={BLOCK_VARIANTS} className="relative">
              <label htmlFor={FIELD_ID.message} className="sr-only">
                Detalle de la consulta
              </label>
              <Textarea
                {...blankProps("message")}
                {...register("message")}
                rows={5}
                placeholder="Cuéntenos el tipo de cartera, su volumen y la antigüedad de la deuda."
                className="border-0 bg-[linear-gradient(transparent_calc(2rem-1px),rgb(var(--line))_2rem)] bg-[length:100%_2rem] py-0 leading-8"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-6 right-0 text-xs tabular-nums",
                  message.length > MESSAGE_MAX ? "text-destructive" : "text-stone",
                )}
              >
                {message.length}/{MESSAGE_MAX}
              </span>
            </motion.div>

            <motion.div variants={BLOCK_VARIANTS} className="font-serif text-display-sm leading-[2.2] text-ink">
              <p>
                Pueden responderme a{" "}
                <Blank
                  {...blankProps("email")}
                  {...register("email")}
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="su email"
                  className="sm:w-[20ch]"
                />{" "}
                o llamarme al{" "}
                <Blank
                  {...blankProps("phone")}
                  {...register("phone")}
                  label="Teléfono (opcional)"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="teléfono (opcional)"
                  className="sm:w-[17ch]"
                />
                <span className="hidden sm:inline">.</span>
              </p>
              <p className="mt-3 italic text-ink-soft">Saludo a ustedes atentamente.</p>
            </motion.div>

            {/* Honeypot: fuera de pantalla y fuera del orden de tabulación */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="contacto-website">No completar este campo</label>
              <input
                id="contacto-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            {/* Resumen de errores, enlazado a cada campo */}
            <AnimatePresence initial={false}>
              {invalidFields.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-1.5 overflow-hidden border-l-2 border-destructive pl-4 text-sm text-destructive"
                >
                  {invalidFields.map((field) => (
                    <li key={field} id={errorId(field)}>
                      <a href={`#${FIELD_ID[field]}`} className="underline-offset-2 hover:underline">
                        {fieldError(field)}
                      </a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <div aria-live="polite" aria-atomic="true">
              {status.state === "error" && (
                <p
                  role="alert"
                  className="flex gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    {status.message} Puede escribirnos directamente a{" "}
                    <a href={`mailto:${site.contact.email}`} className="font-medium underline underline-offset-2">
                      {site.contact.email}
                    </a>
                    .
                  </span>
                </p>
              )}
            </div>

            <motion.div
              variants={BLOCK_VARIANTS}
              className="flex flex-col-reverse gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <p id="contacto-form-nota" className="max-w-[34ch] text-xs leading-relaxed text-stone">
                Sus datos se usan solo para responder esta consulta y se tratan conforme a la Ley
                25.326.
              </p>
              <MagneticButton>
                <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" /> Enviando…
                    </>
                  ) : (
                    <>
                      Firmar y enviar <ArrowRight aria-hidden="true" />
                    </>
                  )}
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

type BlankProps = ComponentProps<"input"> & { label: string };

/** Espacio en blanco de la carta: un input en línea con su etiqueta oculta. */
function Blank({ label, id, className, ...props }: BlankProps) {
  return (
    <span className="inline-block w-full align-baseline sm:w-auto">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "w-full border-0 border-b border-input bg-transparent px-1 pb-0.5 font-sans text-base text-petrol transition-colors duration-400 ease-editorial placeholder:italic placeholder:text-stone/80 hover:border-ink focus-visible:border-petrol focus-visible:shadow-[0_1px_0_0_rgb(var(--petrol))] focus-visible:outline-none aria-[invalid=true]:border-destructive aria-[invalid=true]:shadow-[0_1px_0_0_rgb(var(--destructive))]",
          className,
        )}
        {...props}
      />
    </span>
  );
}

type SuccessMessageProps = { name: string; onReset: () => void };

/** Confirmación de envío. Toma el foco al montarse para anunciarse. */
function SuccessMessage({ name, onReset }: SuccessMessageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex min-h-[28rem] flex-col items-start justify-center"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-petrol text-paper">
        <Check className="size-6" aria-hidden="true" />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="mt-8 text-display-md text-ink">
        Gracias, {name}.
      </h3>
      <p className="mt-4 max-w-measure text-lead text-stone">
        Recibimos su consulta. Un profesional del estudio se comunicará con usted dentro de las 24
        horas hábiles.
      </p>
      <Button type="button" variant="link" className="mt-8 h-auto px-0" onClick={onReset}>
        Enviar otra consulta
      </Button>
    </motion.div>
  );
}
