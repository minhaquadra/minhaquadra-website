/**
 * The organisation `@id` is a cross-repository contract.
 *
 * This site and the Next.js app are about to serve `www.minhaquadra.com.br`
 * together, split by path. Every page here declares a `publisher` (and blog
 * posts an `author`) as an inline `Organization`; the app's home declares one
 * too. Without a shared `@id` those are separate anonymous entities to Google
 * — several here, one more over there — instead of one organisation that owns
 * the whole origin.
 *
 * A shared `@id` is the entire mechanism, and it works only on an exact string
 * match. So the literal is pinned on both sides: this file, and
 * `tests/unit/seo/home-jsonld.test.ts` in `minhaquadra-web`. Changing one
 * without the other silently splits the entity again — nothing errors, the
 * merge just stops happening.
 */
import { ORGANIZATION_ID, WEBSITE_ID } from "../lib/utils/entityIds";

describe("shared entity ids", () => {
  it("pins the organisation id the app also declares", () => {
    expect(ORGANIZATION_ID).toBe(
      "https://www.minhaquadra.com.br/#organization",
    );
  });

  it("pins the website id", () => {
    expect(WEBSITE_ID).toBe("https://www.minhaquadra.com.br/#website");
  });

  it("uses the canonical www host, never the redirecting apex", () => {
    // The apex 308s to www. An entity declared at a URL that redirects is the
    // defect PR #6 fixed for canonicals; the same rule applies to `@id`.
    for (const id of [ORGANIZATION_ID, WEBSITE_ID]) {
      expect(id.startsWith("https://www.minhaquadra.com.br/#")).toBe(true);
    }
  });
});
