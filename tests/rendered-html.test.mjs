import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished Arabic storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ar"[^>]*dir="rtl"/i);
  assert.match(html, /<title>عالم المفروشات \| Alam Al Mafrooshat<\/title>/i);
  assert.match(html, /مفروشات تُكمل إحساس البيت/);
  assert.match(html, /ASO Home Textile/);
  assert.match(html, /aso_home_textile/);
  assert.match(html, /0750 464 0058/);
  assert.match(html, /store-film-01\.mp4/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps all three languages and production assets in source", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /ar:\s*\{/);
  assert.match(page, /ku:\s*\{/);
  assert.match(page, /en:\s*\{/);
  assert.match(page, /document\.documentElement\.dir/);
  assert.match(page, /URLSearchParams\(window\.location\.search\)/);
  assert.match(page, /url\.searchParams\.set\("lang", nextLanguage\)/);
  assert.match(page, /window\.history\.replaceState/);
  assert.match(page, /react-icons\/fa6/);
  assert.match(page, /useSyncExternalStore/);
  assert.match(page, /LANGUAGE_CHANGE_EVENT/);
  assert.match(page, /language-flag--\$\{item\}/);
  assert.match(page, /copy\[item\]\.language/);
  assert.doesNotMatch(page, /🇮🇶|🇬🇧/);
  assert.match(page, /Khanaqa, Erbil, Iraq/);
  assert.match(page, /شركة عالم المفروشات للتجارة العامة \/ المحدودة الخاصة/);
  assert.match(page, /webkitEnterFullscreen/);
  assert.match(page, /film-fullscreen-trigger/);
  assert.match(page, /Watch full screen/);
  assert.match(page, /observer\.unobserve\(entry\.target\)/);
  assert.doesNotMatch(page, /classList\.toggle\("is-visible", entry\.isIntersecting\)/);
  assert.match(page, /key=\{collectionImages\[index\]\}/);
  assert.doesNotMatch(page, /key=\{card\.title\}/);
  assert.match(page, /maps\.app\.goo\.gl/);
  assert.match(layout, /\/og\.png/);
  assert.match(layout, /ar_IQ/);
  assert.match(packageJson, /"name": "alam-al-mafrooshat"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /grid-template-columns:\s*none/);
  assert.match(styles, /grid-auto-columns:\s*minmax\(82vw, 1fr\)/);

  await Promise.all([
    access(new URL("../public/brand/logo.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/media/hero-bed.jpg", import.meta.url)),
  ]);
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
