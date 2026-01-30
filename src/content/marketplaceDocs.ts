/**
 * Example documentation content for marketplace items.
 * Keyed by product id; fallback by product type.
 */

export interface DocBlock {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'note'
  text?: string
  level?: 1 | 2 | 3
  language?: string
  items?: string[]
}

export interface DocSection {
  id: string
  title: string
  blocks: DocBlock[]
}

function section(id: string, title: string, blocks: DocBlock[]): DocSection {
  return { id, title, blocks }
}

function h2(text: string): DocBlock {
  return { type: 'heading', text, level: 2 }
}
function h3(text: string): DocBlock {
  return { type: 'heading', text, level: 3 }
}
function p(text: string): DocBlock {
  return { type: 'paragraph', text }
}
function code(text: string, language = 'text'): DocBlock {
  return { type: 'code', text, language }
}
function list(items: string[]): DocBlock {
  return { type: 'list', items }
}
function note(text: string): DocBlock {
  return { type: 'note', text }
}

/** Documentation content keyed by product id */
const DOCS_BY_ID: Record<string, DocSection[]> = {
  m1: [
    section('quick-start', 'Quick start', [
      h2('Quick start'),
      p('Use the Customer Events API to publish and consume customer lifecycle events. Base URL: https://api.example.com/events/v2.'),
      h3('Authentication'),
      p('Send an API key in the header or use OAuth 2.0. Rate limits: 1,000 requests/minute per key by default.'),
      code(`curl -X POST https://api.example.com/events/v2/publish \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"signup","customer_id":"cust_123","timestamp":"2025-01-29T12:00:00Z"}'`, 'bash'),
      h3('Event types'),
      list(['signup, purchase, support_ticket, support_reply, custom']),
      note('Events are retained for 90 days. Contact Data Platform for longer retention.'),
    ]),
    section('endpoints', 'Endpoints', [
      h2('Endpoints'),
      h3('POST /events/v2/publish'),
      p('Publish one or more events. Body: array of { type, customer_id, timestamp, payload? }.'),
      h3('GET /events/v2/stream'),
      p('Stream events (SSE). Query: from_ts, types, limit.'),
      h3('GET /events/v2/customers/:id/events'),
      p('List events for a customer. Paginated.'),
    ]),
    section('rate-limits', 'Rate limits', [
      h2('Rate limits'),
      p('Per API key: 1,000 requests/minute for publish; 100/minute for stream. Contact Platform for higher limits.'),
    ]),
  ],
  m2: [
    section('overview', 'Overview', [
      h2('Overview'),
      p('Intent Classification Model classifies support tickets and chat messages into 12 intent categories. Use via the Inference API.'),
      h3('Categories'),
      list([
        'Billing & payments',
        'Technical support',
        'Returns & refunds',
        'Account & login',
        'Product questions',
        'Shipping & delivery',
        'Feedback & complaints',
        'Feature requests',
        'Security',
        'Partnership',
        'Other',
      ]),
    ]),
    section('usage', 'Usage', [
      h2('Usage'),
      p('Call the Inference API with text. Response includes top intents and confidence scores.'),
      code(`POST /inference/v1/classify
Content-Type: application/json

{"text": "I can't log into my account, password reset isn't working"}

→ {"intent": "account_login", "confidence": 0.94, "alternatives": [...]}`, 'text'),
      note('Model is retrained monthly on labeled support data. Model card and metrics are in the repo.'),
    ]),
  ],
  m3: [
    section('readme', 'README', [
      h2('use-case-scanner'),
      p('Enterprise AI Use Case Scanner — discover capabilities and gaps. Vite + React + TypeScript.'),
      h3('Setup'),
      code('npm install\nnpm run dev', 'bash'),
      h3('Scripts'),
      list(['dev — start dev server', 'build — production build', 'preview — preview build', 'lint — run ESLint']),
    ]),
  ],
  m4: [
    section('overview', 'Overview', [
      h2('Support Ticket Router'),
      p('Routes incoming support tickets to the right team using the Intent Classification Model. Consumes from the ticket queue and calls the inference API.'),
      h3('Configuration'),
      p('Map intent categories to team queues in config. Default mapping is in the runbook.'),
    ]),
  ],
  m5: [
    section('access', 'Access', [
      h2('Access'),
      p('Data Lake — Customer is built on Delta Lake. Access via SQL (Databricks or Athena) or the Data Catalog.'),
      h3('PII'),
      p('PII columns are masked by default. Request unmasked access through Data Platform; access is audited.'),
      h3('Key tables'),
      list(['events — customer events from Customer Events API', 'profiles — customer profiles', 'support_interactions — support tickets and replies', 'product_usage — product usage events']),
    ]),
    section('schema', 'Schema', [
      h2('Schema'),
      p('All tables use Delta. Partitioning: events by date; profiles by region. See Data Catalog for full column list.'),
    ]),
  ],
  m6: [
    section('overview', 'Overview', [
      h2('Internal API Gateway'),
      p('Organization-wide API gateway. Handles auth (API key, OAuth, mTLS), rate limiting, and routing for all internal APIs.'),
      h3('Registering your API'),
      p('Register your service in the gateway config. Specify path prefix, upstream URL, and auth requirements.'),
    ]),
  ],
  m7: [
    section('overview', 'Overview', [
      h2('ML Ops Pipeline'),
      p('CI/CD and monitoring for ML models. Covers training, evaluation, deployment, and alerting.'),
      h3('Runbooks'),
      list(['Training pipeline — triggers, inputs, outputs', 'Evaluation gates — metrics and thresholds', 'Deployment — staging and production', 'Monitoring — drift and latency alerts']),
    ]),
  ],
  m8: [
    section('api', 'API', [
      h2('Product Catalog Service'),
      p('Microservice for product catalog. Search, filters, and recommendations API.'),
      h3('Endpoints'),
      list(['GET /catalog/products — list/search products', 'GET /catalog/products/:id — product by id', 'GET /catalog/recommendations — personalized recommendations']),
      code('GET /catalog/products?q=shoes&category=footwear&limit=20', 'text'),
    ]),
  ],
  m9: [
    section('deployment', 'Deployment', [
      h2('Deploying ML models'),
      p('This runbook covers deploying and operating ML models in production.'),
      h3('Pre-deploy checklist'),
      list(['Model card updated', 'Evaluation metrics meet thresholds', 'Rollback plan documented', 'Monitoring dashboards configured']),
      h3('Deploy steps'),
      p('1. Promote model artifact to staging. 2. Run smoke tests. 3. Canary 5% traffic. 4. Ramp to 100%.'),
      note('On incident: revert traffic to previous model via pipeline; page ML on-call if needed.'),
    ]),
    section('monitoring', 'Monitoring', [
      h2('Monitoring'),
      p('Track latency p95/p99, error rate, and prediction distribution. Alerts fire on drift and SLA breaches.'),
    ]),
  ],
  m10: [
    section('overview', 'Overview', [
      h2('Feedback Events Dataset'),
      p('Curated dataset of user feedback and ratings for model evaluation. Updated weekly.'),
      h3('Schema'),
      p('Columns: user_id, item_id, rating, feedback_text, category, timestamp. PII is hashed.'),
      h3('Access'),
      p('Request access via Data Catalog. Use for offline evaluation and A/B analysis.'),
    ]),
  ],
  m11: [
    section('overview', 'Overview', [
      h2('SSO Integration'),
      p('Organization SSO via SAML 2.0 and OIDC. All internal apps use this for authentication.'),
      h3('Configuring your app'),
      p('Register the app in the SSO admin console. Set redirect URIs and optional scopes. Use the standard OIDC discovery endpoint for keys and endpoints.'),
    ]),
  ],
  m12: [
    section('api', 'API', [
      h2('Recommendation API'),
      p('Personalized product recommendations for web and mobile. Returns ranked product IDs for a user or context.'),
      code('GET /recommendations?user_id=u123&context=homepage&limit=10', 'text'),
      p('Response: { "items": ["p1", "p2", ...], "scores": [...] }.'),
    ]),
  ],
}

/** Generic docs by product type when no id-specific doc exists */
const DOCS_BY_TYPE: Record<string, DocSection[]> = {
  api: [
    section('overview', 'Overview', [
      h2('API overview'),
      p('This API is available to authenticated clients. See Quick start for authentication and base URL.'),
      h3('Rate limits'),
      p('Rate limits apply per API key. Contact the owner for higher limits.'),
    ]),
  ],
  documentation: [
    section('overview', 'Overview', [
      h2('Documentation'),
      p('This resource contains runbooks, guides, or reference material. Use the link below to open the full documentation.'),
    ]),
  ],
  service: [
    section('overview', 'Overview', [
      h2('Service overview'),
      p('This service is part of the organization catalog. Contact the owner for access and integration details.'),
    ]),
  ],
  default: [
    section('overview', 'Overview', [
      h2('Overview'),
      p('This marketplace item is available for use in scans and use case discovery. See the product detail page for owner and links.'),
    ]),
  ],
}

export function getDocumentationSections(
  productId: string,
  productType: string
): DocSection[] {
  const byId = DOCS_BY_ID[productId]
  if (byId && byId.length > 0) return byId
  const byType = DOCS_BY_TYPE[productType] ?? DOCS_BY_TYPE.default
  return byType
}
