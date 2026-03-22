import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import languagesJSON from "./src/config/language.json";
import rehypeExternalLinks from "rehype-external-links";
import remarkParseContent from "./src/lib/utils/remarkParseContent.ts";
import parseTomlToJson from "./src/lib/utils/parseTomlToJson.ts";

const config = parseTomlToJson("./src/config/config.toml");
let supportedLanguages = [...languagesJSON.map((lang) => lang.languageCode)];

let {
  seo: { sitemap: sitemapConfig },
  settings: {
    multilingual: {
      enable: multilingualEnable,
      showDefaultLangInUrl,
      defaultLanguage,
      disableLanguages,
    },
  },
} = config;

// Remove default language from supportedLanguages
disableLanguages = multilingualEnable
  ? disableLanguages
  : supportedLanguages.map((lang) => lang !== "en" && lang).filter(Boolean);

// Filter out disabled languages from supportedLanguages
const locales = disableLanguages
  ? supportedLanguages.filter((lang) => !disableLanguages.includes(lang))
  : supportedLanguages;

// https://astro.build/config
export default defineConfig({
  site: config.site.baseUrl ? config.site.baseUrl : "http://examplesite.com",
  trailingSlash: config.site.trailingSlash ? "always" : "never",
  i18n: {
    locales: locales,
    defaultLocale: defaultLanguage,
    routing: {
      prefixDefaultLocale: showDefaultLangInUrl,
      // Astro 6: redirectToDefaultLocale requires prefixDefaultLocale: true
      ...(showDefaultLangInUrl ? { redirectToDefaultLocale: false } : {}),
    },
  },
  integrations: [
    react(),
    sitemapConfig.enable ? sitemap({
      filter: (page) =>
        !page.includes('/parceiros-new/') &&
        !page.includes('/minhaquadra/'),
    }) : null,
    AutoImport({
      imports: [
        "@/components/CustomButton.astro",
        "@/shortcodes/Accordion.astro",
        "@/shortcodes/Notice.astro",
        "@/shortcodes/Tabs.astro",
        "@/shortcodes/Tab.astro",
        "@/shortcodes/Testimonial.astro",
        "@/shortcodes/ListCheck.astro",
        "@/shortcodes/ImageList.astro",
        "@/shortcodes/ImageItem.astro",
        "@/shortcodes/VideoInline.astro",
        "@/shortcodes/CardWrapper.astro",
        "@/shortcodes/Card.astro",
      ],
    }),
    mdx(),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      ],
    ],
    remarkPlugins: [
      remarkParseContent, // Parse markdown content and add classes in heading and loading="lazy" to images
      remarkToc,
    ],

    // Code Highlighter https://github.com/shikijs/shiki
    shikiConfig: {
      theme: "light-plus", // https://shiki.style/themes
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss(), reloadOnTomlChange()],
  },
});

// Trigger reload for when changing .toml files
function reloadOnTomlChange() {
  return {
    name: "reload-on-toml-change",
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".toml")) {
        console.log("TOML file changed, triggering reload...");
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
