import { site } from "../lib/site.js";

// Sayfa kendi +title.js'ini vermezse bu varsayılan kullanılır.
export default `${site.fullName} / ${site.tagline}`;
