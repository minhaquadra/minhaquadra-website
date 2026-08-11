import parseTomlToJson from "./parseTomlToJson";
import trailingSlashChecker from "./trailingSlashChecker";

const config = parseTomlToJson("./src/config/config.toml");

/**
 * Stable schema.org `@id` for the Minha Quadra organisation.
 *
 * This site is about to share `www.minhaquadra.com.br` with the Next.js app,
 * routed by path prefix: the app serves `/`, this project keeps `/blog`,
 * `/cidades`, `/esportes` and the legal pages. See the cutover plan in the app
 * repo (`docs/seo/2026-08-11-plano-cutover-dominio-unico.md`).
 *
 * Every page here declares a `publisher` (and blog posts an `author`) as an
 * inline `Organization` with no identity of its own. On one host that reads as
 * a separate anonymous organisation per page, and once the app is serving the
 * home from the same origin, its `Organization` would be yet another one.
 * Naming the node makes all of them resolve to a single entity.
 *
 * The literal must stay byte-identical to `ORGANIZATION_ID` in
 * `minhaquadra-web/src/lib/seo/jsonld.ts` — a shared `@id` is the whole
 * mechanism, and two spellings are two entities.
 *
 * Derived from `config.site.baseUrl`, never from the request origin: a preview
 * or rehearsal host must not mint an entity of its own.
 */
export const ORGANIZATION_ID = trailingSlashChecker(
  `${config.site.baseUrl}#organization`,
);

/** Companion id for the `WebSite` node. */
export const WEBSITE_ID = trailingSlashChecker(
  `${config.site.baseUrl}#website`,
);
