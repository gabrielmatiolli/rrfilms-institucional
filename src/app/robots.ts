import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // O painel e os arquivos enviados por ele ficam fora dos buscadores. As
      // páginas de /admin já mandam `noindex`; aqui o robô nem chega a pedir.
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
