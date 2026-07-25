import { permanentRedirect } from "next/navigation";
import { isLanguage, languagePath } from "../site-config";

type RootPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function RootPage({ searchParams }: RootPageProps) {
  const { lang } = await searchParams;
  permanentRedirect(languagePath(isLanguage(lang) ? lang : "ar"));
}

