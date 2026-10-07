import { Suspense } from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getCatalog } from "@/lib/catalog";
import { site } from "@/lib/site";
import Products from "@/views/Products";

export const dynamic = "force-dynamic";

function labelFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}): Promise<Metadata> {
  const query = await searchParams;
  const category = query.category?.trim();
  const search = query.q?.trim();

  if (search) {
    return {
      title: `Search results for ${search}`,
      description: `Wholesale stationery matching “${search}” from Radhika Copy House.`,
      alternates: { canonical: `/products?q=${encodeURIComponent(search)}` },
      robots: { index: false, follow: true },
    };
  }

  if (category) {
    const name = labelFromSlug(category);
    return {
      title: `${name} Wholesale`,
      description: `Buy ${name.toLowerCase()} in bulk from Radhika Copy House. Manufacturer pricing, MOQ and quantity slabs for retailers and distributors.`,
      alternates: {
        canonical: `/products?category=${encodeURIComponent(category)}`,
      },
    };
  }

  return {
    title: "Wholesale Stationery Catalogue",
    description:
      "Browse notebooks, school copies, registers, long books, drawing books and office stationery. Wholesale prices and minimum order quantities from the manufacturer.",
    alternates: { canonical: "/products" },
  };
}

export default async function ProductsPage() {
  const { products, categories } = await getCatalog();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Radhika Copy House catalogue",
    numberOfItems: products.length,
    itemListElement: products.slice(0, 24).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/products/${product.slug || product._id}`,
      name: product.name,
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />
      <Suspense fallback={<p className="site-section">Loading catalogue...</p>}>
        <Products
          initialProducts={products}
          initialCategories={categories}
        />
      </Suspense>
    </>
  );
}
