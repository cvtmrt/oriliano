import { getProject } from "../../../data/projects.js";
import { site } from "../../../lib/site.js";

// Slug'a göre dinamik meta description (SEO). SSR varsayılan dili TR.
export default function description(pageContext) {
  const p = getProject(pageContext.routeParams?.slug);
  return p ? p.summary.tr : site.seoDescription;
}
