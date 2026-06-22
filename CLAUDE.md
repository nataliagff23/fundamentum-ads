# Fundamentum Ads — Plataforma de Preguntas

## Descripción

Plataforma web para **Imperians Academy / Fundamentum Ads** donde los alumnos de un curso de Google/Meta Ads envían sus preguntas y describen su negocio. El instructor usa esta información para preparar lecciones con ejemplos reales y relevantes para el grupo.

## Stack

- **Frontend:** React 18 + Vite
- **Base de datos:** Airtable (REST API directa desde el frontend)
- **Hosting:** Vercel
- **Repo:** https://github.com/nataliagff23/fundamentum-ads

## Estructura del proyecto

```
fundamentum-app/
├── public/
│   └── favicon.png          # Logo Imperians Academy
├── src/
│   ├── App.jsx              # Wrapper que renderiza FundamentumAds
│   ├── FundamentumAds.jsx   # Componente principal (toda la app)
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos base (vacío, se usan inline styles)
├── .env                     # Variables de entorno (NO se sube a git)
├── index.html
├── package.json
└── vite.config.js
```

## Airtable

- **Base ID:** `app4j1tDrv5gDx6YP`
- **Tabla:** `Preguntas Fundamentum`
- **Campos:**
  - `Nombre` (singleLineText) — nombre del alumno
  - `Nicho` (singleLineText) — industria/nicho del negocio
  - `Descripción del negocio` (multilineText) — qué vende, a quién, cómo
  - `Pregunta para el curso` (multilineText) — pregunta del alumno
  - `Votos` (number) — votos de otros alumnos

## Variables de entorno

Archivo `.env` (local) y configuradas en Vercel:

```
VITE_AIRTABLE_TOKEN=<personal access token>
VITE_AIRTABLE_BASE=app4j1tDrv5gDx6YP
```

## Funcionalidades

### Formulario (vista principal)
1. **Nombre** — campo de texto
2. **Nicho/industria** — dropdown con 13 opciones predefinidas. Si elige "Otro", aparece un input para escribir su nicho personalizado
3. **Descripción del negocio** — textarea
4. **Preguntas para el curso** — una o más preguntas. Botón "+ Agregar otra pregunta" para añadir campos extra. Cada pregunta se envía como registro independiente en Airtable (para que cada una tenga sus propios votos)
5. **Preguntas similares** — al escribir una pregunta, se muestran preguntas similares ya registradas (búsqueda por palabras clave)
6. **Protección doble click** — el botón se deshabilita mientras se envía para evitar registros duplicados

### Lista de preguntas
- Muestra todas las preguntas registradas, ordenadas por votos
- Cada card muestra: pregunta, nombre, nicho (con color), descripción del negocio
- Botón de voto (▲) que incrementa votos en Airtable en tiempo real

## Paleta de colores

```
--bg-primary:     #0F0D05   (negro oliva — fondo principal)
--bg-secondary:   #1A1810   (oliva oscuro — header, inputs)
--bg-card:        #231F10   (oliva medio — cards, formulario)
--gold:           #C9A84C   (oro principal — CTAs, acentos)
--gold-light:     #E2C06A   (oro claro — hover)
--gold-dark:      #8C6E28   (oro oscuro — detalles)
--text-primary:   #FFFFFF   (blanco — títulos)
--text-body:      #D6D2C4   (crema — texto cuerpo)
--text-muted:     #888270   (gris oliva — labels, subtítulos)
--border:         #3a3520   (bordes)
```

## Tipografías

- **Playfair Display** (700, 900) — títulos, marca
- **DM Sans** (300, 400, 500, 700) — cuerpo, labels, botones

## Responsive

- Mobile-first con media query `max-width: 600px`
- En móvil: step numbers ocultos, botón full-width, font-size reducido en placeholders

## Notas

- No hay panel admin (fue removido intencionalmente)
- Los estilos son inline + CSS inyectado via `<style>` tag (no CSS modules)
- El favicon es el logo de Imperians Academy (`Branding/Logo Imperians academy.png`)
