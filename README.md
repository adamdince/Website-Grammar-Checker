# Web Grammar Checker

Menu-driven website grammar & spelling auditor. Triggers from a branded Google Doc, crawls URLs from XML sitemaps or a single URL, runs analysis, and generates a branded Google Doc report.

## Triggering
- **Automated (preferred):** `repository_dispatch` with `event_type=grammar-check` and a `client_payload` matching the schema below.
- **Manual:** GitHub UI → “Run workflow” (uses `workflow_dispatch` inputs).

## Payload schema (client_payload)
```json
{
  "client_id": "client_001",
  "audit_type": "all_sitemaps | selected_sitemaps | single_url",
  "sitemap_selection": ["Main Website","Blog Content"],
  "single_url": "https://example.com/page",
  "report_title": "Website Grammar Audit — 2025-08-30",
  "options": {
    "report_style": "summary|detailed",
    "render_js": false,
    "respect_robots": true,
    "severity_threshold": "suggestion|important|critical",
    "cost_guard": { "mode": "auto|custom", "max_tokens_per_page": 5000 },
    "notify_email": true,
    "per_sitemap_overrides": { "Main Website": { "max_pages": 250 } }
  }
}
```

## Getting started
1. Create repo and push this scaffold.
2. (Later) Configure secrets and service accounts for Google Docs/Drive & OpenAI.
3. Point your Apps Script dispatcher at this repo (`event_type: grammar-check`).

## Structure
See `/src` for modules, `/config` for client/global settings, `/templates` for report branding.
