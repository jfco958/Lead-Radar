# BTG Lead Radar

Sistema inteligente de generación y gestión de leads para **BTG Pactual Colombia**, impulsado por **Claude Opus 4.6** (Anthropic AI).

El radar analiza el mercado colombiano bajo demanda e identifica oportunidades concretas de negocio para los productos de banca de inversión de BTG Pactual: Crédito, Deuda Estructurada, Project Finance, Garantías y Situaciones Especiales.

---

## Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Market Radar** | Análisis de mercado con IA: selecciona sectores y productos, describe el contexto y Claude genera leads calificados con montos, nivel de riesgo y contactos sugeridos |
| **Gestión de Leads** | Lista, filtros por estado / producto / prioridad, creación manual, búsqueda por texto |
| **Detalle del Lead** | Pipeline visual de etapas, edición completa, notas tipificadas (llamada, email, reunión), historial automático de cambios de estado |
| **Pipeline Kanban** | Vista de tablero por etapa comercial |
| **Dashboard** | Métricas en tiempo real: cartera potencial total, tasa de conversión, distribución por producto y sector |

---

## Stack tecnológico

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Base de datos**: SQLite con Prisma ORM
- **IA**: Claude Opus 4.6 con Adaptive Thinking (`@anthropic-ai/sdk`)
- **UI**: Tailwind CSS + Recharts + Lucide React
- **Runtime**: Node.js 18+

---

## Requisitos previos

- Node.js 18 o superior
- Una clave de API de Anthropic → [console.anthropic.com/keys](https://console.anthropic.com/keys)

---

## Instalación y puesta en marcha

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/Lead-Radar.git
cd Lead-Radar

# 2. Instala dependencias (genera el cliente Prisma automáticamente)
npm install

# 3. Configura las variables de entorno
cp .env.example .env
# Edita .env y agrega tu ANTHROPIC_API_KEY

# 4. Crea la base de datos
npm run setup

# 5. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo en `localhost:3000` |
| `npm run build` | Build de producción |
| `npm run start` | Inicia el servidor en modo producción |
| `npm run setup` | Crea o actualiza el esquema de la base de datos SQLite |
| `npm run db:studio` | Abre Prisma Studio (explorador visual de la base de datos) |

---

## Estructura del proyecto

```
Lead-Radar/
├── prisma/
│   └── schema.prisma          # Modelos: Lead, Note, Analysis
├── src/
│   ├── app/
│   │   ├── page.tsx            # Dashboard
│   │   ├── radar/page.tsx      # Market Radar (análisis IA)
│   │   ├── leads/page.tsx      # Lista de leads
│   │   ├── leads/[id]/page.tsx # Detalle del lead
│   │   ├── pipeline/page.tsx   # Vista Kanban
│   │   └── api/                # API routes (leads, analyze, dashboard)
│   ├── components/
│   │   ├── layout/Sidebar.tsx
│   │   └── ui/                 # Badge, Button, Card, Modal, Input
│   ├── lib/
│   │   ├── claude.ts           # Integración con Claude API
│   │   ├── prisma.ts           # Cliente Prisma singleton
│   │   └── utils.ts            # Formateo de moneda, fechas, etc.
│   └── types/index.ts          # Tipos TypeScript y constantes
└── .env.example                # Plantilla de variables de entorno
```

---

## Productos cubiertos

| Producto | Código interno |
|----------|---------------|
| Crédito corporativo | `CREDIT` |
| Deuda Estructurada | `STRUCTURED_DEBT` |
| Project Finance | `PROJECT_FINANCE` |
| Garantías | `GUARANTEE` |
| Situaciones Especiales | `SPECIAL_SITUATIONS` |

---

## Cómo usar el Market Radar

1. Ve a **Market Radar** en el menú lateral
2. Selecciona uno o más **productos** de BTG Pactual
3. Selecciona los **sectores económicos** colombianos a analizar
4. Escribe el **contexto de mercado** (coyuntura, reformas, tendencias actuales)
5. Elige cuántos leads generar (4 – 10)
6. Haz clic en **"Iniciar Análisis de Mercado"** — el análisis tarda 30–60 segundos
7. Revisa los leads sugeridos y guarda los que te interesen
8. Gestiona el seguimiento desde **Leads** y **Pipeline**

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Sí | Clave de API de Anthropic para Claude |
| `DATABASE_URL` | ✅ Sí | URL de SQLite, por defecto `file:./dev.db` |

---

## Licencia

Uso interno — BTG Pactual Colombia.
