// Express + Vike (SSR) sunucusu. Geliştirmede Vite middleware, üretimde dist.
// Bu pazarlama sitesi veritabanı kullanmaz; içerik tamamen data/ dosyalarından gelir.
import express from "express";
import http from "http";
import compression from "compression";
import { renderPage } from "vike/server";
import { site } from "../lib/site.js";
import { projects } from "../data/projects.js";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const root = process.cwd();

async function startServer() {
  const app = express();
  app.use(compression());

  // SEO: robots.txt + sitemap.xml (site.url ve projelerle senkron).
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
  });
  app.get("/sitemap.xml", (_req, res) => {
    const urls = ["/", ...projects.map((p) => `/case/${p.slug}`)];
    const body =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) => `  <url><loc>${site.url}${u}</loc><changefreq>monthly</changefreq></url>`).join("\n") +
      `\n</urlset>\n`;
    res.type("application/xml").send(body);
  });

  const server = http.createServer(app);

  if (isProduction) {
    const sirv = (await import("sirv")).default;
    app.use(sirv(`${root}/dist/client`, { extensions: [] }));
  } else {
    const vite = await import("vite");
    const viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true, hmr: { server } },
    });
    app.use(viteDevServer.middlewares);
  }

  app.get(/.*/, async (req, res, next) => {
    // Express 4 async hataları yakalamaz — renderPage fırlatırsa (ör. deploy
    // sonrası eski hash'li asset isteği) istek sonsuza dek cevapsız kalıyordu.
    try {
      const pageContextInit = {
        urlOriginal: req.originalUrl,
        headersOriginal: req.headers,
      };
      const pageContext = await renderPage(pageContextInit);
      const { httpResponse } = pageContext;
      if (!httpResponse) return next();

      const { statusCode, headers, body } = httpResponse;
      headers.forEach(([name, value]) => res.setHeader(name, value));
      res.status(statusCode).send(body);
    } catch (err) {
      next(err);
    }
  });

  server.listen(port);
  console.log(`${site.fullName} çalışıyor → http://localhost:${port}`);
}

startServer();
