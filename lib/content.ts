// Contenido institucional del sitio. Textos de muestra con el tono buscado;
// las cifras son ilustrativas y deben reemplazarse por datos reales.

export type Service = {
  slug: "cobranzas" | "juridico" | "contable" | "recupero";
  title: string;
  /** Bajada corta para la fila del índice. */
  summary: string;
  description: string;
  items: readonly string[];
};

export const services: readonly Service[] = [
  {
    slug: "cobranzas",
    summary: "Mora temprana y tardía",
    title: "Gestión de cobranzas",
    description:
      "Administración integral de carteras en mora temprana y tardía, con contacto multicanal y trato respetuoso.",
    items: ["Gestión telefónica y digital", "Acuerdos de pago a medida", "Reportes periódicos de avance"],
  },
  {
    slug: "juridico",
    summary: "Estrategia y representación",
    title: "Asesoramiento jurídico",
    description:
      "Análisis de documentación, estrategia legal y representación en cada instancia del reclamo.",
    items: ["Revisión de títulos y contratos", "Intimaciones y cartas documento", "Juicios ejecutivos y ordinarios"],
  },
  {
    slug: "contable",
    summary: "Liquidación y conciliación",
    title: "Gestión contable",
    description:
      "Liquidación de deudas, conciliación de saldos y control de la cartera con criterio contable.",
    items: ["Liquidación de intereses", "Conciliación de cuentas corrientes", "Informes para auditoría"],
  },
  {
    slug: "recupero",
    summary: "Créditos de difícil cobro",
    title: "Recupero de créditos",
    description:
      "Estrategias para créditos de difícil cobro, con una evaluación previa de viabilidad y costos.",
    items: ["Evaluación de solvencia", "Medidas cautelares", "Seguimiento hasta el cobro efectivo"],
  },
];

export type Value = { title: string; description: string };

export const values: readonly Value[] = [
  {
    title: "Confidencialidad",
    description:
      "La información de su cartera y de cada deudor se trata con reserva absoluta, conforme a la Ley 25.326 de Protección de Datos Personales.",
  },
  {
    title: "Ética profesional",
    description:
      "Reclamamos con firmeza y dentro del marco legal, garantizando un trato digno al deudor en línea con la Ley de Defensa del Consumidor.",
  },
  {
    title: "Resultados",
    description:
      "Medimos cada gestión. Usted accede a reportes claros sobre el estado de la cartera y lo efectivamente recuperado.",
  },
];

export type Step = {
  title: string;
  description: string;
  timing: string;
  /** Lo que el cliente recibe al cerrar la etapa. */
  deliverable: { title: string; description: string };
};

export const steps: readonly Step[] = [
  {
    title: "Diagnóstico",
    description:
      "Analizamos la cartera, la documentación respaldatoria y la antigüedad de cada deuda para fijar prioridades.",
    timing: "Primera semana",
    deliverable: {
      title: "Informe de cartera",
      description: "Composición, antigüedad y prioridades de recupero de cada segmento.",
    },
  },
  {
    title: "Estrategia",
    description:
      "Definimos un plan por segmento: canales de contacto, tono, plazos y condiciones aceptables de acuerdo.",
    timing: "Semanas 1 y 2",
    deliverable: {
      title: "Plan de gestión",
      description: "Canales, plazos y condiciones de acuerdo, validados con su empresa.",
    },
  },
  {
    title: "Gestión y negociación",
    description:
      "Contactamos a cada deudor y negociamos acuerdos viables, siempre documentados y con seguimiento de cumplimiento.",
    timing: "Gestión continua",
    deliverable: {
      title: "Reporte mensual de avance",
      description: "Gestiones realizadas, acuerdos firmados y montos cobrados en el período.",
    },
  },
  {
    title: "Instancia judicial y cierre",
    description:
      "Si no hay acuerdo, iniciamos las acciones legales que correspondan e informamos cada avance hasta el cobro.",
    timing: "Según el caso",
    deliverable: {
      title: "Rendición final",
      description: "Detalle de lo recuperado y del estado de cada caso al cierre.",
    },
  },
];

export type Stat = { value: number; prefix?: string; suffix?: string; label: string };

export const stats = {
  years: { value: 18, label: "años de trayectoria" },
  cases: { value: 42000, label: "casos gestionados" },
  clients: { value: 150, label: "empresas clientes" },
  recovery: { value: 72, suffix: " %", label: "de recupero promedio" },
} satisfies Record<string, Stat>;

/** Nota al pie de la cifra de recupero. */
export const statsFootnote = "Promedio de recupero sobre carteras con hasta 90 días de mora.";

/** Membrete del hero: datos breves, estilo encabezado de documento. */
export const heroMeta: readonly string[] = [
  "Estudio jurídico-contable",
  "Rosario, Santa Fe",
  "Cobranzas · Recupero · Asesoramiento",
];

export const heroFacts: readonly { title: string; text: string }[] = [
  { title: "Prejudicial y judicial", text: "Cobertura en todas las instancias" },
  { title: "Abogados y contadores", text: "Un mismo equipo por caso" },
  { title: "Reportes mensuales", text: "Trazabilidad de cada gestión" },
];
