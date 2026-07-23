import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عالم المفروشات | Alam Al Mafrooshat",
  description: "A family-run home textile store in Erbil, established in 1995. Bedding, blankets, carpets and home accessories.",
  applicationName: "Alam Al Mafrooshat",
  keywords: ["Alam Al Mafrooshat", "ASO Home Textile", "Erbil", "bedding", "blankets", "carpets", "مفروشات", "هەولێر"],
  icons: {
    icon: "/brand/logo.png",
    shortcut: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
  openGraph: {
    type: "website",
    title: "عالم المفروشات | Alam Al Mafrooshat",
    description: "Textiles that make home feel complete — family-run in Erbil since 1995.",
    locale: "ar_IQ",
    alternateLocale: ["en_IQ", "ku_IQ"],
    images: [{ url: "/og.png", width: 1732, height: 909, alt: "Alam Al Mafrooshat — Erbil, since 1995" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "عالم المفروشات | Alam Al Mafrooshat",
    description: "Textiles that make home feel complete — family-run in Erbil since 1995.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
