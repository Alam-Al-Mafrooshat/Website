import type { MetadataRoute } from "next";
import {
  LANGUAGES,
  SITE_URL,
  languageAlternates,
  languagePath,
} from "./site-config";

const absoluteLanguageAlternates = Object.fromEntries(
  Object.entries(languageAlternates).map(([locale, path]) => [
    locale,
    `${SITE_URL}${path}`,
  ]),
);

export default function sitemap(): MetadataRoute.Sitemap {
  return LANGUAGES.map((language) => ({
    url: `${SITE_URL}${languagePath(language)}`,
    lastModified: new Date("2026-07-25T00:00:00+03:00"),
    changeFrequency: "monthly",
    priority: language === "ar" ? 1 : 0.9,
    alternates: { languages: absoluteLanguageAlternates },
  }));
}

