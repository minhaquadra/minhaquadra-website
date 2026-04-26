import parseTomlToJson from "@/lib/utils/parseTomlToJson";
import { defineCollection, z } from "astro:content";
import { button, sectionsSchema } from "./sections.schema";
import { glob } from "astro/loaders";

const config = parseTomlToJson("./src/config/config.toml");
const portfolioFolder = config.settings.portfolioFolder || "portfolio";
const blogFolder = config.settings.blogFolder || "blog";
const servicesFolder = config.settings.servicesFolder || "services";

// Universal Page Schema
export const page = z.object({
  title: z.string(),
  author: z.string().optional(),
  categories: z.array(z.string()).default(["others"]).optional(),
  tags: z.array(z.string()).default(["others"]).optional(),
  date: z.date().optional(), // example date format 2022-01-01 or 2022-01-01T00:00:00+00:00 (Year-Month-Day Hour:Minute:Second+Timezone)
  description: z.string().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
  button: button.optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  robots: z.string().optional(),
  excludeFromSitemap: z.boolean().optional(),
  excludeFromCollection: z.boolean().optional(),
  customSlug: z.string().optional(),
  canonical: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  disableTagline: z.boolean().optional(),
  ...sectionsSchema,
});

// Marquee Schema
export const marqueeConfig = z.object({
  elementWidth: z.string(),
  elementWidthAuto: z.boolean(),
  elementWidthInSmallDevices: z.string(),
  pauseOnHover: z.boolean(),
  reverse: z.enum(["reverse", ""]).optional(), // Optional: "reverse" or an empty string
  duration: z.string(),
});

// Pages collection schema — Astro 6: requires glob loader
const pagesCollection = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: page,
});

// Service collection schema — Astro 6: requires glob loader
const serviceCollection = defineCollection({
  loader: glob({ base: `./src/content/${servicesFolder}`, pattern: "**/*.{md,mdx}" }),
  schema: page.merge(
    z.object({
      icon: z.string().optional(),
    }),
  ),
});

// Post collection schema
const blogCollection = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: page.merge(
    z.object({
      author: z.string().optional(),
      readingTime: z.string().optional(),
      relatedSports: z.array(z.string()).default([]).optional(),
      options: z
        .object({
          layout: z
            .enum(["grid", "creative", "horizontal", "overlay"])
            .optional(),
          appearance: z.enum(["dark", "light"]).optional(),
          columns: z
            .union([z.literal(1), z.literal(2), z.literal(3)])
            .optional(),
          limit: z.union([z.number().int(), z.literal(false)]).optional(),
        })
        .optional(),
    }),
  ),
});

// Portfolio Collection
const portfolioCollection = defineCollection({
  // Load Markdown and MDX files in the `src/content/portfolio/` directory.
  loader: glob({ base: "./src/content/portfolio", pattern: "**/*.{md,mdx}" }),
  schema: page.merge(
    z.object({
      images: z.array(z.string()).min(1).optional(),
      options: z
        .object({
          layout: z.enum(["masonry", "grid", "full-width", "slider"]),
          appearance: z.enum(["dark", "light"]).optional(),
          limit: z.union([z.number().int(), z.literal(false)]).optional(),
        })
        .optional(),
      information: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          }),
        )
        .optional(),
    }),
  ),
});

// Team Collection
export const teamCollection = defineCollection({
  loader: glob({ base: "./src/content/team", pattern: "**/*.{md,mdx}" }),
  schema: page.merge(
    z.object({
      image: z.string(),
      profession: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      social: z
        .array(
          z.object({
            enable: z.boolean(),
            label: z.string(),
            icon: z.string(),
            url: z.string(),
          }),
        )
        .optional(),
    }),
  ),
});

// Quadras Collection
const quadrasCollection = defineCollection({
  loader: glob({ base: "./src/content/quadras", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    state: z.string(),
    description: z.string(),
    sports: z.array(z.string()),
    appLink: z.string(),
    image: z.string().optional(),
  }),
});

// Estados Collection (Cidades section)
const estadosCollection = defineCollection({
  loader: glob({ base: "./src/content/cidades/estados", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    sigla: z.string(),
    description: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    cidades: z.array(z.string()).default([]),
  }),
});

// Cidades Collection (Cidades section)
const cidadesCollection = defineCollection({
  loader: glob({ base: "./src/content/cidades/cidades", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    estado: z.string(),
    estadoNome: z.string(),
    description: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    esportes: z
      .array(
        z.object({
          slug: z.string(),
          nome: z.string(),
          temBlog: z.boolean().default(false),
          blogUrl: z.string().default(""),
          resumo: z.string(),
        }),
      )
      .default([]),
  }),
});

// Esportes Collection
const esportesCollection = defineCollection({
  loader: glob({ base: "./src/content/esportes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    heroSubtitle: z.string(),
    description: z.string(),
    benefits: z.array(z.object({
      title: z.string(),
      text: z.string(),
    })),
    howToPlay: z.string(),
    equipment: z.string(),
    courtTypes: z.string(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
    relatedSports: z.array(z.string()).default([]),
    ctaText: z.string(),
    image: z.string().optional(),
  }),
});

// Export collections
export const collections = {
  [blogFolder]: blogCollection,
  blog: blogCollection,
  sections: defineCollection({
    loader: glob({ base: "./src/content/sections", pattern: "**/*.{md,mdx}" }),
  }),
  esportes: esportesCollection,
  quadras: quadrasCollection,
  estados: estadosCollection,
  cidades: cidadesCollection,
};
