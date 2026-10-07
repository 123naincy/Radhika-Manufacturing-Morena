import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categories } = await getCatalog();
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/products",
    "/about",
    "/contact",
    "/wholesale",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${site.url}${path || "/"}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes = categories
    .filter((category) => category.isActive && category.slug)
    .map((category) => ({
      url: `${site.url}/products?category=${encodeURIComponent(category.slug)}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const productRoutes = products.map((product) => ({
    url: `${site.url}/products/${product.slug || product._id}`,
    lastModified: product.updatedAt
      ? new Date(product.updatedAt)
      : lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
