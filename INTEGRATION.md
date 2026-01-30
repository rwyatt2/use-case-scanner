# Enterprise integration guide

Use Case Scanner is designed for **frictionless, low-risk** integration into your infrastructure.

## Principles

- **Read-only** — Scans do not write to your systems. The app only reads from APIs/catalogs you configure.
- **No secrets in the client** — API keys and credentials are never stored in the browser. Use your existing auth (SSO, API gateway, or backend-only keys).
- **Configurable endpoints** — Point the app at your own backend via `VITE_SCAN_API_URL` at build time. No hardcoded production URLs.
- **Audit-ready** — Your backend can log scan requests and results for compliance. The app does not send PII unless you explicitly pass it to your API.

## Build-time configuration

| Variable | Purpose |
|----------|---------|
| `VITE_SCAN_API_URL` | Base URL of your Use Case Scanner backend (e.g. `https://scanner-api.yourcompany.com`). Leave unset for demo mode (mock data). |

Example:

```bash
VITE_SCAN_API_URL=https://scanner-api.yourcompany.com npm run build
```

## Backend API contract

Your backend should implement:

1. **POST `/scan`** — Accepts `{ title: string, description: string }`. Returns `ScanResult` (existing capabilities + gaps). Scans your API catalog, docs, repos, data catalog (read-only).
2. **POST `/documents/analyze`** — Accepts `{ documents: DocumentInput[] }`. Returns `{ suggestedUseCases: SuggestedUseCase[] }`. AI reads document content and suggests use cases.
3. **GET `/marketplace`** — Optional. Query params: `scope`, `types`, `q`, `sort`. Returns `MarketplaceProduct[]`. When feature flag “Use mock marketplace” is off, the app calls this.

All responses should be JSON. Use standard HTTP status codes (401 for auth, 429 for rate limit, etc.).

## Authentication

- **Option A:** Put the app and API behind your existing SSO or API gateway. The app does not handle login; your reverse proxy or gateway does.
- **Option B:** Your backend returns 401 for unauthenticated requests. The app will show a user-friendly message; you can redirect to your IdP or show a login page in your deployment.

## Feature flags

Users can toggle “Use mock marketplace data” in Settings or via the Dev Panel (Ctrl+Shift+D). When off, the app uses only your catalog API (or shows empty marketplace). Flags are stored in `localStorage`; for enterprise you may want to sync these with your backend or remove the mock option in production.

## Accessibility and compliance

- Skip link, focus management, and semantic HTML are in place for accessibility.
- No third-party analytics or tracking are included. Add your own in the deployment layer if required.
- For audit, log scan requests and (anonymized or summarized) results in your backend.

## Deployment checklist

- [ ] Set `VITE_SCAN_API_URL` to your backend URL at build time.
- [ ] Serve the built app (e.g. `dist/`) over HTTPS behind your auth layer.
- [ ] Ensure your backend allows CORS from the app’s origin (or use same-origin deployment).
- [ ] Document your API contract and any rate limits for internal consumers.
