import handler from "vinext/server/app-router-entry";

const supportedLanguages = new Set(["ar", "ku", "en"]);

const worker = {
  async fetch(request: Request, env: unknown, context: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/" && url.searchParams.has("lang")) {
      const requestedLanguage = url.searchParams.get("lang") ?? "ar";
      const language = supportedLanguages.has(requestedLanguage)
        ? requestedLanguage
        : "ar";

      return Response.redirect(new URL(`/${language}`, url), 308);
    }

    return handler.fetch(request, env, context);
  },
};

export default worker;
