# Website operations

This is the durable operating reference for the Alam Al Mafrooshat website. It describes the deployed system as it exists after the initial launch on 2026-07-24. It is technical reference, not an active project plan.

## Production system

- Public site: <https://alam-al-mafrooshat.com>
- Source: <https://github.com/Alam-Al-Mafrooshat/Website>
- Production branch: `main`
- Hosting: Cloudflare Workers with Workers Builds and static assets
- Worker name: `alam-al-mafrooshat`
- Framework: Vinext, React, Vite, and the Cloudflare Vite plugin
- Content model: source code and files only; no CMS, database, accounts, or runtime content API
- Languages: Arabic (default), Kurdish, and English

The application is not the same kind of pure static export used by the TCA hosting spike. Vinext produces a small server Worker plus browser assets under `dist/client`. Wrangler deploys both, while Cloudflare serves matching static assets through the `ASSETS` binding.

## Cloudflare build settings

The Cloudflare dashboard's Worker build configuration is:

| Setting | Value |
| --- | --- |
| Repository | `Alam-Al-Mafrooshat/Website` |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `npm test` |
| Deploy command | `npx wrangler deploy` |
| Non-production command | `npx wrangler versions upload` |
| Build variables | none |

Use a project-specific Workers Builds API token. Never store the token or any Cloudflare credential in the repository. There is deliberately no GitHub Actions deployment workflow: a push to `main` triggers Cloudflare's native build and deploy flow.

`wrangler.jsonc` is the source of truth for Worker configuration. The production build generates a flattened deployment configuration under `dist/server/wrangler.json`; never edit that generated file.

## Normal content release

1. Update visible content in all three language objects in `app/page.tsx`.
2. Put production-ready media under `public/media` using descriptive filenames. Preserve supplied originals under `Images` or `Video` unless intentionally retiring them.
3. Run `npm test` and `npm run lint`.
4. Review and push the change to `main`.
5. Watch the build under Cloudflare Worker → Deployments → Build history.
6. Smoke-test the homepage, language switcher, Instagram link, map link, phone link, logo, one image, and one video on the custom domain.

`npm test` is the Cloudflare build command because it first runs the production build and then verifies server rendering, translations, and required assets. This replaces a separate GitHub Actions quality gate.

## Domain and TLS state

Launch verification on 2026-07-24 established:

- `https://alam-al-mafrooshat.com/` returns HTTP 200 from Cloudflare and contains the production storefront.
- The logo, a representative JPEG, and a representative MP4 return HTTP 200 with correct content types.
- `www.alam-al-mafrooshat.com` is not configured and does not resolve. The apex hostname is canonical.
- Plain `http://alam-al-mafrooshat.com/` currently returns the site instead of redirecting to HTTPS.

For a strict HTTPS launch posture, enable **SSL/TLS → Edge Certificates → Always Use HTTPS** in the Cloudflare zone, then verify that the HTTP URL returns a redirect to the HTTPS URL. Cloudflare documents this setting at <https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/>.

If `www` is ever needed, add it deliberately as a Cloudflare hostname and redirect it to the apex domain. Do not serve two independent canonical copies of the site.

## Compatibility date

`wrangler.jsonc` pins a Cloudflare Workers `compatibility_date`. It is a runtime-behavior baseline, not an expiration date. The current value is intentionally a date already completed in UTC.

- Keep the value committed and stable; old compatibility dates remain valid.
- Never generate it automatically from Baghdad's local date around midnight. Cloudflare may still be on the previous UTC date and will reject a future value with error `10021`.
- Update it deliberately when upgrading Vinext, Vite, the Cloudflare plugin, or Wrangler. Review Cloudflare compatibility changes, run the complete test suite, and perform a Wrangler dry run before deploying.

Reference: <https://developers.cloudflare.com/workers/configuration/compatibility-dates/>.

## Validation commands

```bash
npm test
npm run lint
npx wrangler deploy --dry-run
```

Expected deployment shape after a build:

- Worker entry generated under `dist/server`
- Browser assets under `dist/client`
- One runtime binding: `ASSETS`
- No D1, R2, KV, Images, or secret bindings

Generated paths such as `dist`, `.vite`, `.wrangler`, `node_modules`, and `.vs` are ignored and must not be committed.

## Rollback and recovery

For an urgent production rollback, open Cloudflare Workers & Pages → `alam-al-mafrooshat` → Deployments, open the menu for the last known-good version, and choose **Rollback**. Cloudflare immediately makes that version active. Official reference: <https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/>.

After stabilizing production, revert or repair the source change and push a normal follow-up commit so Git and the active deployment agree again.

For a failed build:

- Open the failed item in Build history and read the first actual error, not only the final failure line.
- After correcting and pushing source, Cloudflare should start a new build automatically.
- A build may also be retried from its Build Details page.
- If authentication becomes stale, create/select a new project-specific build token rather than reusing a token named for another project.

## Local Windows ownership gotcha

If a repository directory is created by a sandboxed coding agent, Windows may assign the sandbox identity as owner. Git then reports “detected dubious ownership” when Visual Studio runs as the normal user. Prefer correcting the actual directory owner from an Administrator terminal rather than permanently bypassing Git's ownership check:

```powershell
icacls "<repository-path>" /setowner "<windows-user>" /T /C
```

Adding `.vs` to `.gitignore` only prevents new Visual Studio state files from being added. Files already tracked must also be removed from the repository in a normal reviewed change.
