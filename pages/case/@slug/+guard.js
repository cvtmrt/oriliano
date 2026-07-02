import { render } from "vike/abort";
import { getProject } from "../../../data/projects.js";

// Bilinmeyen slug → gerçek 404 durumu (soft-404 yerine). Arama motoru
// olmayan vakaları indexlemeye çalışmaz.
export function guard(pageContext) {
  if (!getProject(pageContext.routeParams?.slug)) {
    throw render(404);
  }
}
