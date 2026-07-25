import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Storefront from "../storefront";
import {
  INSTAGRAM_URL,
  LANGUAGES,
  MAP_URL,
  PHONE_NUMBER,
  SITE_URL,
  isLanguage,
  languageAlternates,
  languageConfig,
  languagePath,
  localizedSeo,
  type Language,
} from "../site-config";

type LanguagePageProps = {
  params: Promise<{ lang: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LanguagePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};

  const seo = localizedSeo[lang];
  const locale = languageConfig[lang];
  const path = languagePath(lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: path,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: "Alam Al Mafrooshat",
      title: seo.title,
      description: seo.description,
      locale: locale.locale,
      alternateLocale: LANGUAGES
        .filter((language) => language !== lang)
        .map((language) => languageConfig[language].locale),
      images: [{
        url: "/og.png",
        width: 1732,
        height: 909,
        alt: seo.imageAlt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "home textiles",
  };
}

function structuredData(language: Language) {
  const seo = localizedSeo[language];
  const locale = languageConfig[language];
  const pageUrl = `${SITE_URL}${languagePath(language)}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Alam Al Mafrooshat",
        alternateName: ["عالم المفروشات", "ASO Home Textile"],
        inLanguage: LANGUAGES.map((item) => languageConfig[item].htmlLang),
        publisher: { "@id": `${SITE_URL}/#business` },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        inLanguage: locale.htmlLang,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#business` },
        primaryImageOfPage: `${SITE_URL}/og.png`,
      },
      {
        "@type": "HomeGoodsStore",
        "@id": `${SITE_URL}/#business`,
        name: seo.businessName,
        alternateName: ["Alam Al Mafrooshat", "عالم المفروشات", "ASO Home Textile"],
        description: seo.description,
        url: pageUrl,
        logo: `${SITE_URL}/brand/logo.png`,
        image: [
          `${SITE_URL}/og.png`,
          `${SITE_URL}/media/store-front.jpg`,
          `${SITE_URL}/media/store-interior.jpg`,
        ],
        telephone: PHONE_NUMBER,
        foundingDate: "1995",
        address: {
          "@type": "PostalAddress",
          ...seo.address,
          addressCountry: "IQ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 36.191246,
          longitude: 44.012489,
        },
        hasMap: MAP_URL,
        sameAs: [INSTAGRAM_URL],
        areaServed: {
          "@type": "AdministrativeArea",
          name: seo.address.addressRegion,
        },
      },
    ],
  };
}

export default async function LanguagePage({ params }: LanguagePageProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const jsonLd = JSON.stringify(structuredData(lang)).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Storefront language={lang} />
    </>
  );
}

