# ACORD@R SRL — Sitio institucional (variante con fotografía)

> Variante del sitio original (`ACORD@R - WEB`) con fotografía de personas. Mismo diseño, contenido y funcionalidad; suma imágenes en el hero, los servicios, Nosotros y Contacto.

Landing de una sola página para ACORD@R SRL, estudio jurídico-contable especializado en gestión integral de cobranzas. Navegación por anclas, animaciones editoriales y formulario de contacto con envío real por email.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** estricto
- **Tailwind CSS 3** con design tokens propios + componentes base de **shadcn/ui**
- **Framer Motion** (entradas, stagger, layout), **GSAP + ScrollTrigger** (parallax, pin, línea del proceso), **Lenis** (smooth scroll)
- **react-hook-form + zod** (validación compartida cliente/servidor) y **Resend** para el envío
- **Lucide** (íconos) y **next/font** (Fraunces + Inter, autoalojadas)

> El brief original pedía Next 14 + React 18. Se usa Next 16 + React 19 porque Next 14 tiene vulnerabilidades críticas sin parche (ejecución remota de código), corregidas solo a partir de Next 16.

## Requisitos

- Node.js **20.9 o superior** (probado con 24 LTS)
- npm 10+

## Instalación

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
npm run dev                  # http://localhost:3000
```

### Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Chequeo de tipos con TypeScript |

## Variables de entorno

Se cargan desde `.env.local` (no se sube al repositorio).

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `RESEND_API_KEY` | Sí, para enviar | API key de [Resend](https://resend.com/api-keys) |
| `CONTACT_FROM_EMAIL` | Sí, para enviar | Remitente. Debe pertenecer a un dominio verificado en Resend, p. ej. `ACORD@R Web <web@acordar.com.ar>` |
| `CONTACT_TO_EMAIL` | No | Casilla que recibe las consultas. Por defecto, el email de `lib/site.ts` |
| `NEXT_PUBLIC_SITE_URL` | No | URL pública del sitio, para metadatos, Open Graph, sitemap y robots |

Sin `RESEND_API_KEY` el sitio funciona igual: el formulario valida y, al enviar, muestra un aviso con el email del estudio como alternativa.

### Configurar Resend

1. Crear una cuenta en [resend.com](https://resend.com).
2. En **Domains**, agregar el dominio del estudio y cargar los registros DNS que indica Resend en el proveedor del dominio.
3. Crear una API key en **API Keys** y completarla en `.env.local`.
4. Para probar antes de verificar el dominio se puede usar `CONTACT_FROM_EMAIL=onboarding@resend.dev`. En ese modo Resend solo entrega al email de la propia cuenta.

Cada consulta llega con **Reply-To** apuntando al email de quien escribió, así se responde directamente desde la casilla.

## Estructura

```
app/
  layout.tsx            Fuentes, metadatos, Navbar, Footer y proveedores
  page.tsx              Composición de secciones
  globals.css           Tokens de color (CSS variables), utilidades y keyframes
  api/contact/route.ts  Envío del formulario (validación, anti-spam, Resend)
  robots.ts, sitemap.ts SEO
components/
  Hero, Services, About, Process, Stats, Contact, Footer, Navbar
  ServiceIndex          Índice de servicios (acordeón con barrido de tinta)
  Manifesto             Texto que se enciende palabra por palabra con el scroll
  ContactForm + LazyContactForm   Carta con espacios a completar (carga diferida)
  SectionHeading, Logo, AnchorLink, StructuredData, Providers
  motion/               Reveal, RevealText, MagneticButton, Counter, Rings,
                        SmoothScroll (Lenis), useParallax (GSAP)
  ui/                   button, card, input, textarea, label (shadcn/ui)
lib/
  site.ts               Datos institucionales (dirección, email, teléfono, CUIT)
  content.ts            Textos: servicios, valores, pasos del proceso y métricas
  validations.ts        Esquema zod del formulario
  fonts.ts, motion.ts, gsap.ts, utils.ts
public/                 logo.svg, logo-mark.svg (favicon)
```

## Editar contenido

- **Datos de contacto y legales:** `lib/site.ts`
- **Textos de secciones y métricas:** `lib/content.ts`
- **Títulos con énfasis:** en `RevealText`, el texto entre `*asteriscos*` se muestra en itálica de color.
- **Colores:** `app/globals.css` (`:root`) y `tailwind.config.ts`

## Design system

| Token | Valor | Uso |
| --- | --- | --- |
| `petrol` | `#0E5C5C` | Primario |
| `gold` | `#C9A24B` | Acento **decorativo** (filetes, aros, puntos). No usar como texto sobre fondo claro (2,2:1) |
| `gold-deep` | `#7A5C17` | Texto dorado sobre fondo claro (5,7:1) |
| `gold-light` | `#E3CB8F` | Texto dorado sobre petróleo (4,9:1) |
| `paper` / `paper-deep` | `#F7F5F0` / `#EFEBE3` | Fondos |
| `ink` | `#1A1A1A` | Texto principal |
| `stone` | `#666666` | Texto secundario (AA sobre todos los fondos) |

Tipografía: **Fraunces** (display, con eje óptico) e **Inter** (cuerpo), con escala fluida `text-display-*` y `text-lead`.

## Concepto visual

El sitio toma el lenguaje de un documento jurídico contemporáneo: secciones numeradas con `§`, membrete en el hero, título compuesto en escalera, servicios como índice, valores como articulado (`Art. 1º`), cifras dentro de una oración con nota al pie y el formulario como una carta con espacios a completar.

## Fotografía

- Las fotos viven en `assets/fotos/` y se configuran en `lib/photos.ts` (textos alternativos y encuadre).
- Son **provisorias**: imágenes de StockSnap con licencia CC0 (dominio público, uso comercial libre). Créditos en `assets/fotos/CREDITOS.md`. Ideal: reemplazarlas por fotos propias del estudio, de al menos 2000 px de ancho, conservando los nombres de archivo.
- Componente `components/Photo.tsx`: optimización con next/image (AVIF/WebP, lazy-load, desenfoque mientras carga), revelado tipo telón, parallax interno y epígrafe `Fig. N`.
- Tratamiento de color común (`.photo-tone`) para unificar fotos de distintas fuentes; en Nosotros, viraje a petróleo (duotono).
- En Servicios, en desktop, una foto flotante sigue al cursor sobre cada fila; al desplegar un servicio, la foto aparece en el panel.

## Movimiento y accesibilidad

- Curva de animación compartida `[0.22, 1, 0.36, 1]` (`lib/motion.ts`).
- La entrada del hero usa **CSS puro** para no esperar la hidratación (mejor LCP en mobile). El resto de las animaciones usa Framer Motion y GSAP.
- **`prefers-reduced-motion`:** se desactivan Lenis, el parallax, la rotación de los aros y los desplazamientos. Framer queda solo con fundidos y la línea del proceso se muestra completa.
- HTML semántico, link "Saltar al contenido", foco visible, errores del formulario vinculados con `aria-describedby`, foco gestionado en el menú mobile y en la confirmación de envío.

## Rendimiento (Lighthouse 12, build de producción)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile (throttling real) | 91 | 100 | 100 | 100 |
| Mobile (throttling simulado) | 86–87 | 100 | 100 | 100 |

La medición simulada en `localhost` subestima el LCP mobile: con un servidor local instantáneo, todo el JavaScript se ejecuta antes del primer pintado y el simulador lo suma al LCP. La medición con throttling real da LCP ≈ 2,6 s y CLS ≈ 0. Conviene volver a medir con [PageSpeed Insights](https://pagespeed.web.dev/) sobre el dominio publicado.

## Despliegue

Pensado para **Vercel**: importar el repositorio, cargar las variables de entorno y desplegar. Funciona en cualquier hosting que soporte Next.js (`npm run build && npm start`).

El límite de envíos por IP del formulario vive en memoria. Alcanza para un único servidor; con varias instancias serverless conviene moverlo a un store compartido, como Upstash Redis.

## Antes de publicar

- [ ] Reemplazar el logo provisorio (`public/logo.svg`, `public/logo-mark.svg`, `components/Logo.tsx`) por el original
- [ ] Reemplazar las **métricas de ejemplo** de `lib/content.ts` por cifras reales
- [ ] Completar teléfono, email, CUIT y horario reales en `lib/site.ts` (la dirección ya está cargada)
- [ ] Revisar los textos de `lib/content.ts` con el estudio
- [ ] Verificar el dominio en Resend y configurar las variables de entorno en el hosting
- [ ] Definir `NEXT_PUBLIC_SITE_URL` con el dominio definitivo
- [ ] Opcional: imagen para compartir en redes (`app/opengraph-image.png`)
