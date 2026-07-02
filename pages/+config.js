import vikeReact from "vike-react/config";
import Layout from "../layouts/LayoutDefault.jsx";
import Head from "../layouts/HeadDefault.jsx";

// Vike + vike-react global yapılandırması (SSR varsayılan açık).
export default {
  Layout,
  Head,
  lang: "tr",
  extends: vikeReact,
};
