import type { Metadata } from "next";
import { isLanguage, languageConfig, SITE_URL } from "../site-config";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Alam Al Mafrooshat",
  creator: "Alam Al Mafrooshat",
  publisher: "Alam Al Mafrooshat",
  icons: {
    icon: "/brand/logo.png",
    shortcut: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
};

type LanguageLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>;

export default async function LanguageLayout({ children, params }: LanguageLayoutProps) {
  const { lang } = await params;
  const language = isLanguage(lang) ? lang : "ar";
  const locale = languageConfig[language];

  return (
    <html lang={locale.htmlLang} dir={locale.direction}>
      <body>{children}</body>
    </html>
  );
}

