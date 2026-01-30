# Use Case Scanner — Enterprise AI Discovery

An enterprise search app that lets users describe **AI use cases** and runs a full scan of your infrastructure to find what already supports that use case. If something’s missing, users can start building the capability or service from the app.

Built for **minimal friction and risk** when integrating into existing infrastructure and operations.

## Features

- **Use case input** — Users describe the AI use case (title + description).
- **AI scan** — Scans connected systems (APIs, docs, repos, data catalogs) for existing capabilities that support the use case.
- **Results** — Clear view of **existing capabilities** (with relevance) and **gaps** (what doesn’t exist yet).
- **Start building** — For each gap: export a spec (JSON) or create a ticket (when integrated with your ticketing system).
- **Settings** — Configure scan API URL and connected systems (placeholders for your backend connectors).
- **Enterprise-ready** — Read-only scanning, no writes to your systems; auth and audit via your stack.

## Tech stack

- **Vite** + **React** + **TypeScript**
- **React Router** for routing
- CSS modules for styling (dark, enterprise-style theme)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

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

3. **Auth** — Add your SSO or API-key auth in front of the app and/or API (e.g. reverse proxy, API gateway).

4. **Connectors** — In your backend, add read-only connectors to:
   - API catalog / service registry  
   - Internal docs (Confluence, Notion, etc.)  
   - Code repos (metadata, READMEs)  
   - Data catalog  

5. **Ticketing** — Optional: in Settings / “Start building”, wire “Create ticket” to Jira, Linear, GitHub Issues, etc., so users can create tickets from a gap.

## Demo mode

If `VITE_SCAN_API_URL` is not set, the app runs in **demo mode**: each scan returns mock results so you can try the full flow (input → results → existing vs gaps → start building / export spec) without a backend.

## Project structure

```
src/
  components/     # Layout, shared UI
  pages/          # Dashboard, NewUseCase, ScanResults, BuildCapability, Settings
  services/       # scan.ts — API client + mock
  types.ts        # UseCase, ScanResult, ExistingCapability, CapabilityGap, etc.
```

## License

Private / commercial — use and sell as you need.
