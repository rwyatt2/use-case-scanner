# Use Case Scanner — Enterprise AI Discovery

An enterprise app that lets users describe **AI use cases** and runs a full scan of your infrastructure to find what already supports that use case. If something’s missing, users can start building the capability or service from the app.

Built for **minimal friction and risk** when integrating into existing infrastructure and operations.

## Value proposition

Use Case Scanner delivers **real, measurable value** from day one:

- **Ship faster** — Go from “do we have something for this?” to a clear map in minutes. No manual catalog trawling or cross-team ping-pong. Turn weeks of discovery into hours.
- **Avoid duplicate work** — See what already exists (APIs, models, data) before you build. Reuse instead of reimplementing; cut wasted engineering and reduce technical debt.
- **One source of truth** — Use cases, scan results, and gaps live in one place. Share links with stakeholders, keep alignment without extra docs or spreadsheets.
- **Audit-ready** — Read-only scanning and exportable specs. Prove what you have, what you’re building, and how it ties to use cases—for compliance, governance, and board reporting.

**Why it’s safe:** Read-only scan (no writes to your systems), your auth and catalog, no lock-in, export and audit trail. Integrate in minutes.

## Features

- **Landing page** — Public marketing page with hero, steps, benefits, and CTAs. Alternating section backgrounds and Lunaris design tokens.
- **Login** — Demo auth (admin / generic user). Protected routes redirect to login; state persisted in `localStorage`.
- **Dashboard** — Chat-first interface: describe a use case or paste a document; AI suggests scans or use cases. Sidebar: Favorites, My use cases, Recent scans; links to Marketplace, Documentation, Settings.
- **Marketplace** — Browse APIs, models, repos, applications, databases, services, documentation, datasets, integrations. Filter by scope (Mine / Organization) and type; search and sort. Type badges (icon + label) and colored left borders. Favorites stored in `localStorage`.
- **Documentation** — `/docs` hub: product docs (Getting started, Scans, Marketplace, Documents, Settings) and marketplace item docs. Each item has `/marketplace/:id/docs` with sections (Quick start, API, Usage, etc.). Breadcrumbs and themed scrollbar.
- **Use case flow** — Describe a use case → run scan → view results (existing vs gaps) → build capability (export spec or create ticket). New Use Case pane from header; scan and build pages.
- **Documents flow** — Add docs (upload or paste) → AI recommends use cases → select and scan. Chat accepts attachments for doc analysis.
- **Breadcrumbs** — App-wide navigation: path-based defaults plus custom breadcrumbs on detail/docs pages. Dashboard shows no breadcrumb strip.
- **Settings** — Configure scan API URL, toggle mock marketplace data. Feature flags (Dev Panel) for theme and mock data.
- **Design** — Lunaris design system (light/dark theme), Geist + JetBrains Mono, CSS variables, themed scrollbar, responsive layout.

## Tech stack

- **Vite** + **React** + **TypeScript**
- **React Router** v6 for routing
- **CSS modules** + design tokens (Lunaris) for styling; light/dark theme support

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

- **Landing** — `/` (public).
- **Login** — `/login` (demo: `admin@example.com` / `admin123` or any email / `demo`).
- **Dashboard** — `/dashboard` (protected).
- **Marketplace** — `/marketplace`; item detail `/marketplace/:id`; docs `/marketplace/:id/docs`.
- **Documentation hub** — `/docs`.
- **New scan** — `/scan`; results `/results/:scanId`; build gap `/build/:gapId`.
- **Documents** — `/documents`; recommendations `/documents/recommendations`.
- **Settings** — `/settings`.

## Integration (selling to companies)

1. **Backend** — Implement a scan API that:
   - Accepts use case (title, description).
   - Queries your API catalog, docs, repos, data catalog (via connectors).
   - Uses AI to match use case to existing capabilities and identify gaps.
   - Returns structured `ScanResult` (existing + gaps).

2. **Build** — Set `VITE_SCAN_API_URL` to your backend URL so the app calls your API:
   ```bash
   VITE_SCAN_API_URL=https://your-scanner-api.example.com npm run build
   ```

3. **Auth** — Replace demo login with your SSO or API-key auth (e.g. reverse proxy, API gateway).

4. **Marketplace** — When mock data is off, point the app at your catalog API (e.g. `/marketplace` and `/marketplace/:id`) so marketplace and docs reflect your assets.

5. **Connectors** — In your backend, add read-only connectors to:
   - API catalog / service registry  
   - Internal docs (Confluence, Notion, etc.)  
   - Code repos (metadata, READMEs)  
   - Data catalog  

6. **Ticketing** — Optional: wire “Create ticket” (Build capability) to Jira, Linear, GitHub Issues, etc.

## Demo mode

If `VITE_SCAN_API_URL` is not set, scans use **mock results**. With “Use mock marketplace data” on (Settings or Dev Panel), the marketplace shows sample APIs, models, repos, and docs so you can try the full flow without a backend.

## Project structure

```
src/
  components/     # Layout, Breadcrumbs, ChatInput, ChatMessageList, ProfileMenu,
                 # NewUseCasePane, ProtectedRoute, Skeleton, ErrorBoundary, DevPanel
  content/        # marketplaceDocs.ts — example doc content per marketplace item
  context/       # Auth, Breadcrumb, Chat, Favorites, FeatureFlags
  hooks/          # useScrollReveal
  lib/            # api, marketplaceTypes, myUseCases
  pages/          # Landing, Login, Dashboard, Marketplace, MarketplaceDetail,
                 # MarketplaceDocs, Docs, AddDocuments, RecommendedUseCases,
                 # NewUseCase, ScanResults, BuildCapability, Settings, NotFound
  services/       # scan, documents, marketplace
  types.ts        # UseCase, ScanResult, MarketplaceProduct, etc.
  index.css       # Lunaris tokens, scrollbar, global styles
```

## License

Private / commercial — use and sell as you need.
