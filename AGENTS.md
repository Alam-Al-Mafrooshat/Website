# Alam Al Mafrooshat Website

## Project summary

This is the source-managed multilingual website for Alam Al Mafrooshat, a family-run home-textile store in Erbil. It uses Vinext and React, has no CMS or database, and deploys as a Cloudflare Worker-compatible site.

## Commands

- `npm run dev` — start the local site.
- `npm run build` — create the production build.
- `npm test` — build and verify the rendered page and required assets.

## Architecture

- `app/page.tsx` contains the one-page site, all Arabic/Kurdish/English copy, the language switcher, and external contact links.
- `app/globals.css` contains all visual and responsive styling.
- `app/layout.tsx` owns site metadata, icons, and social-preview settings.
- `public/brand/` contains the production logo.
- `public/media/` contains the curated storefront images and videos.
- `.openai/hosting.json` contains Sites hosting bindings only.

## Conventions

- Arabic is the default language. Arabic and Kurdish use right-to-left layout; English uses left-to-right layout.
- Update all three language objects together when changing visible copy.
- Keep page content in source. Do not add a CMS, database, or runtime content API unless the product requirements genuinely change.
- Use normalized, descriptive filenames for new production media under `public/media/`. Preserve the original source assets in `Images/` and `Video/`.
- Keep Instagram, map, and other external destinations in constants near the top of `app/page.tsx`.
- Do not edit generated output under `dist/` or `build/`.
