# Overview

American Iron LLC is a full-stack web application for a heavy equipment and parts company based in Tampa, Florida. The site serves as a business-facing platform for browsing equipment inventory, parts catalogs, requesting quotes, and learning about services (dismantling, inspection, transportation, shipping). It is a content-rich marketing and e-commerce-style site for the industrial/construction equipment industry.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **Build Tool**: Vite with React plugin
- **Directory**: All frontend code lives in `client/src/`
  - Pages in `client/src/pages/`
  - Reusable components in `client/src/components/`
  - shadcn/ui primitives in `client/src/components/ui/`
  - Hooks in `client/src/hooks/`
  - Utilities in `client/src/lib/`

### Backend
- **Framework**: Express 5 on Node.js with TypeScript
- **Runtime**: tsx for development, esbuild for production bundling
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Directory**: All server code lives in `server/`
  - `server/index.ts` — Express app setup, middleware, HTTP server creation
  - `server/routes.ts` — API route registration (equipment, parts, quotes, contact)
  - `server/storage.ts` — Data access layer with `IStorage` interface and `DatabaseStorage` implementation
  - `server/db.ts` — PostgreSQL connection pool and Drizzle ORM instance
  - `server/seed.ts` — Database seeding with sample equipment and parts data
  - `server/vite.ts` — Vite dev server middleware integration for development
  - `server/static.ts` — Static file serving for production builds

### Shared Code
- `shared/schema.ts` — Drizzle ORM table definitions and Zod validation schemas, shared between client and server
- Path alias `@shared/*` maps to `shared/*`

### Database
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema Management**: `drizzle-kit push` for schema migrations (no migration files, direct push)
- **Connection**: `DATABASE_URL` environment variable required, uses `pg.Pool`
- **Tables**:
  - `equipment` — Heavy equipment listings (id, equipmentId, make, model, year, meter, price, location, category, imageUrl)
  - `parts` — Parts catalog (id, partNumber, description, category, subcategory, price, compatibility, engineModel, gasket, equipment, imageUrl) — 17,554 items from parsed Costex catalog across 14 categories
  - `quote_requests` — Quote request submissions (name, email, phone, shipTo, notes, items)
  - `contact_inquiries` — Contact form submissions (name, email, message)
  - `users` — User accounts (id, username) — exists in schema but auth not fully implemented
  - `project_estimates` — AI-generated project estimates (projectName, projectType, location, terrain, projectSize, duration, additionalDetails, estimateResult)
  - `power_units` — Power units & generators inventory (id, stockNumber, model, category, hp, kw, rpm, year, condition, location, price, imageUrl) — 95 items across 4 categories: Generator Sets (40), Marine Engines (26), Power Units (21), Industrial Generators (8)
  - `conversations` / `messages` — Chat storage tables (from OpenAI integration)

### API Endpoints
- `GET /api/equipment` — List equipment with optional `category` and `search` query filters
- `GET /api/equipment/:id` — Get single equipment item by equipmentId
- `GET /api/parts` — List parts with pagination and filters (`category`, `subcategory`, `search`, `page`, `limit`); returns `{ items, total }`
- `GET /api/parts/subcategories/counts` — Get part counts by subcategory, optionally filtered by `category`
- `GET /api/parts/:id` — Get single part by database ID
- `POST /api/quotes` — Submit a quote request (validated with Zod)
- `POST /api/contact` — Submit a contact inquiry (validated with Zod)
- `GET /api/power-units` — List power units with optional `category` and `search` filters, pagination
- `GET /api/power-units/categories/counts` — Get power unit counts by category
- `GET /api/power-units/:id` — Get single power unit by database ID
- `POST /api/estimate` — IRON Estimator: AI-powered equipment estimator (streaming SSE response, uses OpenAI gpt-5.2 with real inventory data)
- `POST /api/quotes/send-email` — Send quote email with PDF attachment (uses Resend API + PDFKit); accepts { email, itemType, itemId, quoteNumber, quoteDate }

### AI Integration
- **Provider**: Replit AI Integrations (OpenAI-compatible, no API key needed)
- **Model**: gpt-5.2 for project estimation
- **Feature**: IRON Estimator at `/services/estimator` — generates comprehensive construction project equipment estimates using real inventory pricing data
- **Integration files**: `server/replit_integrations/` (chat, audio, image, batch modules)

### Build System
- **Development**: `npm run dev` — runs tsx with Vite dev server middleware for HMR
- **Production Build**: `npm run build` — runs `script/build.ts` which builds client with Vite and server with esbuild
- **Production Start**: `npm run start` — serves built `dist/index.cjs`
- **Database Push**: `npm run db:push` — pushes Drizzle schema to PostgreSQL

### Key Design Decisions
1. **Monorepo structure** — Client, server, and shared code in one repo with path aliases (`@/`, `@shared/`)
2. **Storage interface pattern** — `IStorage` interface in `server/storage.ts` abstracts database operations, making it possible to swap implementations
3. **Schema-first validation** — Drizzle schemas in `shared/schema.ts` generate both database tables and Zod validation schemas, ensuring consistency
4. **Server-side rendering not used** — This is a client-side SPA with API backend; Vite handles dev serving and builds static assets for production

## External Dependencies

### Required Services
- **PostgreSQL Database** — Required. Connected via `DATABASE_URL` environment variable. Uses `pg` driver with Drizzle ORM.

### Key NPM Packages
- **drizzle-orm / drizzle-kit** — ORM and migration tooling for PostgreSQL
- **express** (v5) — HTTP server framework
- **@tanstack/react-query** — Client-side data fetching and caching
- **wouter** — Lightweight client-side routing
- **zod** — Runtime validation (used with drizzle-zod and react-hook-form)
- **shadcn/ui** — Component library (Radix UI + Tailwind CSS)
- **connect-pg-simple** — PostgreSQL session store (listed in deps, session setup may be partial)

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal` — Error overlay in development
- `@replit/vite-plugin-cartographer` — Dev tooling (development only)
- `@replit/vite-plugin-dev-banner` — Dev banner (development only)

### Font Dependencies
- Google Fonts: DM Sans, Fira Code, Geist Mono, Architects Daughter (loaded via CDN in `index.html`)