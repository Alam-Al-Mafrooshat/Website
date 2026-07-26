# Alam Al Mafrooshat

Source-managed website for **عالم المفروشات / Alam Al Mafrooshat**, a family-run home-textile store in Erbil.

Production: [alam-al-mafrooshat.com](https://alam-al-mafrooshat.com)

The site is a multilingual Arabic, Kurdish, and English one-page storefront built with React and Vinext. It has no CMS, database, accounts, or runtime content service. Copy, media, contact details, and links are managed directly in this repository.

This is a small independent favor project, not a ShiftSoftware company project. Its durable technical and operational context intentionally lives here rather than in `.shift`.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run lint
```

`npm test` creates the production build before running rendered-page, language, and required-asset checks. Cloudflare uses it as the build command so deployments retain a quality gate without GitHub Actions.

## Change approval and deployment

Third-party changes follow the reviewed pull-request workflow in [AGENTS.md](AGENTS.md#third-party-developer-handoff). After an authorized merge to `main`, Cloudflare Workers Builds deploys the updated site.

> **Practice PR:** This documentation-only note practices the owner review and merge workflow; it changes no website functionality or deployment settings.

![Owner approval and Cloudflare deployment workflow](docs/assets/owner-pr-approval-deployment-workflow.png)

```mermaid
flowchart TD
    A["Third-party developer<br/>forks, changes, and tests"] --> B["Opens PR targeting main<br/>plain-language summary and evidence"]
    B --> C{"Owner chooses<br/>an authorized review path"}
    C -->|Owner review| D["Owner reviews in GitHub Mobile<br/>trusted developer guides in person"]
    D --> E{"Owner decision"}
    E -->|Changes requested| A
    E -->|Approved| H["Authorized merge into main"]
    C -->|Support review| F["Owner explicitly asks designated trusted support<br/>to review the named PR"]
    F --> G{"Support team decision"}
    G -->|Changes requested| A
    G -->|Approved| H
    H --> I["Cloudflare Workers Builds runs npm test<br/>then npx wrangler deploy"]
    I --> J{"Deployment succeeds?"}
    J -->|Yes| K["Live site updated"]
    J -->|No| L["Technical support investigates"]
```

## Content map

- `app/page.tsx` — page structure, all three translations, map/Instagram/phone destinations.
- `app/globals.css` — responsive layout and visual system.
- `app/layout.tsx` — search and social metadata.
- `public/brand/` — regenerated production logo.
- `public/media/` — curated images and short shop videos used by the page.
- `Images/`, `Video/`, and `logo.jpg` — original supplied source assets retained for future curation.
- `wrangler.jsonc` — Cloudflare Worker and static-assets configuration.
- `docs/operations.md` — deployment, domain, verification, rollback, and troubleshooting reference.

Arabic is the default. When copy changes, update the Arabic, Kurdish, and English entries together.

## Launch history

- **2026-07-23/24:** created the first multilingual site from the supplied name, logo, Instagram page, map pin, photos, and videos; regenerated the low-resolution logo and established the black, gold, and white visual system.
- **2026-07-24:** moved the website into the dedicated `Website` repository under the `Alam-Al-Mafrooshat` GitHub organization.
- **2026-07-24:** configured Cloudflare Workers Builds with direct GitHub integration and no GitHub Actions, removed unused starter/D1 scaffolding, and validated the Worker bundle.
- **2026-07-24:** launched [alam-al-mafrooshat.com](https://alam-al-mafrooshat.com).
