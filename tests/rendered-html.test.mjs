import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
      redirect: "manual",
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

test("permanently redirects the root and legacy language queries", async () => {
  const [root, legacyKurdish, invalidLanguage] = await Promise.all([
    render("/"),
    render("/?lang=ku"),
    render("/?lang=invalid"),
  ]);

  assert.equal(root.status, 308);
  assert.equal(root.headers.get("location"), "http://localhost/ar");
  assert.equal(legacyKurdish.status, 308);
  assert.equal(legacyKurdish.headers.get("location"), "http://localhost/ku");
  assert.equal(invalidLanguage.status, 308);
  assert.equal(invalidLanguage.headers.get("location"), "http://localhost/ar");
});

test("server-renders indexable, localized SEO for all three languages", async () => {
  const cases = [
    {
      route: "ar",
      htmlLang: "ar-IQ",
      direction: "rtl",
      title: "عالم المفروشات | مفروشات ومستلزمات نوم في أربيل",
      hero: "مفروشات تُكمل إحساس البيت",
      descriptionFragment: "مستلزمات النوم والفنادق",
    },
    {
      route: "ku",
      htmlLang: "ckb-IQ",
      direction: "rtl",
      title: "عالم المفروشات | کەل و پەلی نوستن و هۆتێل لە هەولێر",
      hero: "ڕاخەرانی ماڵ کە هەستی تەواوی دەبەخشێت",
      descriptionFragment: "کەل و پەلی نوستن و هۆتێل",
    },
    {
      route: "en",
      htmlLang: "en-IQ",
      direction: "ltr",
      title: "Bedding &amp; Home Textiles in Erbil | Alam Al Mafrooshat",
      hero: "Textiles that make home feel complete",
      descriptionFragment: "Retail, wholesale, and delivery available",
    },
  ];

  for (const item of cases) {
    const response = await render(`/${item.route}`);
    assert.equal(response.status, 200, item.route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.ok(
      html.includes(`<html lang="${item.htmlLang}" dir="${item.direction}"`),
      `${item.route} html language`,
    );
    assert.ok(html.includes(`<title>${item.title}</title>`), `${item.route} title`);
    assert.ok(html.includes(item.hero), `${item.route} visible content`);
    assert.ok(html.includes(item.descriptionFragment), `${item.route} description`);
    assert.ok(
      html.includes(`<link rel="canonical" href="https://alam-al-mafrooshat.com/${item.route}"`),
      `${item.route} canonical`,
    );
    assert.match(html, /<meta name="robots" content="index, follow/i);
    assert.match(html, /<meta property="og:title"/i);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/i);
    assert.match(html, /<script type="application\/ld\+json">/i);
    assert.match(html, /"@type":"HomeGoodsStore"/);
    assert.match(html, /"@type":"GeoCoordinates"/);
    assert.match(html, /"latitude":36\.191246/);
    assert.match(html, /"telephone":"\+9647504640058"/);
    assert.match(html, /href="\/ar"/);
    assert.match(html, /href="\/ku"/);
    assert.match(html, /href="\/en"/);

    for (const locale of ["ar-IQ", "ckb-IQ", "en-IQ", "x-default"]) {
      assert.ok(
        html.includes(`hrefLang="${locale}"`),
        `${item.route} alternate ${locale}`,
      );
    }
  }
});

test("serves robots and a localized sitemap", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);

  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//i);
  assert.match(robots, /Sitemap: https:\/\/alam-al-mafrooshat\.com\/sitemap\.xml/i);

  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  for (const language of ["ar", "ku", "en"]) {
    assert.match(
      sitemap,
      new RegExp(`<loc>https://alam-al-mafrooshat\\.com/${language}</loc>`),
    );
  }
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 3);
  assert.equal((sitemap.match(/hreflang=/g) ?? []).length, 12);
});

test("keeps SEO architecture and production assets in source", async () => {
  const [
    storefront,
    languagePage,
    languageLayout,
    siteConfig,
    sitemap,
    robots,
    worker,
    packageJson,
    styles,
  ] = await Promise.all([
    readFile(new URL("../app/storefront.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/[lang]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/[lang]/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(storefront, /ar:\s*\{/);
  assert.match(storefront, /ku:\s*\{/);
  assert.match(storefront, /en:\s*\{/);
  assert.match(storefront, /href=\{languagePath\(item\)\}/);
  assert.match(storefront, /hrefLang=\{languageConfig\[item\]\.hreflang\}/);
  assert.doesNotMatch(storefront, /URLSearchParams|history\.replaceState|useSyncExternalStore/);
  assert.match(storefront, /react-icons\/fa6/);
  assert.match(storefront, /language-flag--\$\{item\}/);
  assert.match(storefront, /copy\[item\]\.language/);
  assert.doesNotMatch(storefront, /🇮🇶|🇬🇧/);
  assert.match(storefront, /webkitEnterFullscreen/);
  assert.match(storefront, /observer\.unobserve\(entry\.target\)/);
  assert.match(storefront, /key=\{collectionImages\[index\]\.src\}/);
  assert.doesNotMatch(storefront, /key=\{card\.title\}/);
  assert.match(storefront, /fetchPriority="high"/);
  assert.match(storefront, /width=\{1125\}/);

  assert.match(languagePage, /generateStaticParams/);
  assert.match(languagePage, /generateMetadata/);
  assert.match(languagePage, /languageAlternates/);
  assert.match(languagePage, /HomeGoodsStore/);
  assert.match(languagePage, /GeoCoordinates/);
  assert.match(languagePage, /application\/ld\+json/);
  assert.match(languageLayout, /lang=\{locale\.htmlLang\}/);
  assert.match(languageLayout, /dir=\{locale\.direction\}/);
  assert.match(siteConfig, /ckb-IQ/);
  assert.match(siteConfig, /https:\/\/alam-al-mafrooshat\.com/);
  assert.match(siteConfig, /مفروشات ومستلزمات نوم في أربيل/);
  assert.match(siteConfig, /کەل و پەلی نوستن و هۆتێل لە هەولێر/);
  assert.match(sitemap, /MetadataRoute\.Sitemap/);
  assert.match(sitemap, /absoluteLanguageAlternates/);
  assert.match(robots, /MetadataRoute\.Robots/);
  assert.match(worker, /url\.searchParams\.has\("lang"\)/);
  assert.match(worker, /Response\.redirect/);

  assert.match(styles, /grid-template-columns:\s*none/);
  assert.match(styles, /grid-auto-columns:\s*minmax\(82vw, 1fr\)/);
  assert.match(packageJson, /"name": "alam-al-mafrooshat"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/brand/logo.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/media/hero-bed.jpg", import.meta.url)),
  ]);
  await assert.rejects(access(new URL("../app/page.tsx", templateRoot)));
  await assert.rejects(access(new URL("../app/layout.tsx", templateRoot)));
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
