export const SITE_URL = "https://alam-al-mafrooshat.com";
export const INSTAGRAM_URL = "https://www.instagram.com/aso_home_textile/";
export const MAP_URL = "https://maps.app.goo.gl/1vM1ctcVCXHQw4tF8?g_st=iw";
export const PHONE_NUMBER = "+9647504640058";
export const PHONE_DISPLAY = "07504640058";

export const LANGUAGES = ["ar", "ku", "en"] as const;

export type Language = (typeof LANGUAGES)[number];

export function isLanguage(value: string | null | undefined): value is Language {
  return LANGUAGES.includes(value as Language);
}

export const languageConfig = {
  ar: {
    htmlLang: "ar-IQ",
    hreflang: "ar-IQ",
    direction: "rtl" as const,
    locale: "ar_IQ",
  },
  ku: {
    htmlLang: "ckb-IQ",
    hreflang: "ckb-IQ",
    direction: "rtl" as const,
    locale: "ckb_IQ",
  },
  en: {
    htmlLang: "en-IQ",
    hreflang: "en-IQ",
    direction: "ltr" as const,
    locale: "en_IQ",
  },
} satisfies Record<Language, {
  htmlLang: string;
  hreflang: string;
  direction: "ltr" | "rtl";
  locale: string;
}>;

export const localizedSeo = {
  ar: {
    title: "عالم المفروشات | مفروشات ومستلزمات نوم في أربيل",
    description: "عالم المفروشات في خانقاه، أربيل. مستلزمات النوم والفنادق، مفارش، بطانيات وسجاد بالمفرد والجملة بأسعار مناسبة مع خدمة التوصيل.",
    businessName: "عالم المفروشات",
    address: {
      streetAddress: "خانقاه",
      addressLocality: "أربيل",
      addressRegion: "محافظة أربيل",
    },
    imageAlt: "عالم المفروشات في أربيل — مستلزمات النوم والمفروشات المنزلية",
  },
  ku: {
    title: "عالم المفروشات | کەل و پەلی نوستن و هۆتێل لە هەولێر",
    description: "عالم المفروشات لە خانەقا، هەولێر؛ کەل و پەلی نوستن و هۆتێل، جلی جێخەو، پەتوو و فەرش بە تاک و کۆ و بە گونجاوترین نرخ، گەیاندن هەیە.",
    businessName: "عالم المفروشات",
    address: {
      streetAddress: "خانەقا",
      addressLocality: "هەولێر",
      addressRegion: "پارێزگای هەولێر",
    },
    imageAlt: "عالم المفروشات لە هەولێر — کەل و پەلی نوستن و ڕاخەرانی ماڵ",
  },
  en: {
    title: "Bedding & Home Textiles in Erbil | Alam Al Mafrooshat",
    description: "Shop bedding, blankets, carpets, and hotel sleep supplies at Alam Al Mafrooshat in Khanaqa, Erbil. Retail, wholesale, and delivery available.",
    businessName: "Alam Al Mafrooshat",
    address: {
      streetAddress: "Khanaqa",
      addressLocality: "Erbil",
      addressRegion: "Erbil Governorate",
    },
    imageAlt: "Alam Al Mafrooshat in Erbil — bedding and home textiles",
  },
} satisfies Record<Language, {
  title: string;
  description: string;
  businessName: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
  };
  imageAlt: string;
}>;

export function languagePath(language: Language) {
  return `/${language}`;
}

export const languageAlternates = Object.fromEntries(
  LANGUAGES.map((language) => [
    languageConfig[language].hreflang,
    languagePath(language),
  ]),
) as Record<string, string>;

languageAlternates["x-default"] = "/ar";
