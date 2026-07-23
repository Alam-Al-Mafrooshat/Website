# Alam Al Mafrooshat

Source-managed website for **عالم المفروشات / Alam Al Mafrooshat**, a family-run home-textile store in Erbil.

The site is a multilingual Arabic, Kurdish, and English one-page storefront built with React and Vinext. It has no CMS, database, accounts, or runtime content service. Copy, media, contact details, and links are managed directly in the repository.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
```

## Content map

- `app/page.tsx` — page structure, all three translations, map/Instagram/phone destinations.
- `app/globals.css` — responsive layout and visual system.
- `app/layout.tsx` — search and social metadata.
- `public/brand/` — regenerated production logo.
- `public/media/` — curated images and short shop videos used by the page.
- `Images/`, `Video/`, and `logo.jpg` — original supplied source assets.

Arabic is the default. When copy changes, update the Arabic, Kurdish, and English entries together.
