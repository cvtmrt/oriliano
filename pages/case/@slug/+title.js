import { getProject } from "../../../data/projects.js";
import { site } from "../../../lib/site.js";

// Slug'a göre dinamik sayfa başlığı (SEO).
export default function title(pageContext) {
  const p = getProject(pageContext.routeParams?.slug);
  return p ? `${p.name} / ${site.fullName}` : `${site.fullName} / ${site.tagline}`;
}
