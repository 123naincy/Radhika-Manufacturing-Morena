import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { getProduct } from "@/lib/catalog";
import { site } from "@/lib/site";
import ProductDetails from "@/views/ProductDetails";

export const dynamic = "force-dynamic";

function categoryName(product: {
  category: string | { name?: string };
}) {
  return typeof product.category === "object"
    ? product.category.name || "Stationery"
    : "Stationery";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/products/${product.slug || slug}`;
  const description = product.description.slice(0, 155);

  return {
    title: `${product.name} Wholesale`,
    description,
    keywords: [
      product.name,
      categoryName(product),
      "wholesale",
      "bulk stationery",
      product.sku,
    ],
    alternates: { canonical: path },
    openGraph: {
      title: `${product.name} | Radhika Copy House`,
      description,
      url: path,
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const path = `/products/${product.slug || slug}`;
  const url = `${site.url}${path}`;
  const group = categoryName(product);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: site.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: `${site.url}/products`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.name,
          item: url,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.sku,
      description: product.description,
      brand: {
        "@type": "Brand",
        name: product.brand || site.name,
      },
      category: group,
      image: product.images?.filter(Boolean),
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "INR",
        price: product.basePrice,
        availability:
          product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          minValue: product.moq,
          unitCode: "C62",
        },
        seller: {
          "@type": "Organization",
          name: site.name,
        },
      },
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <ProductDetails initialProduct={product} />
    </>
  );
}
