import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getCatalog } from "@/lib/catalog";
import { site } from "@/lib/site";
import Home from "@/views/Home";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Wholesale Stationery Manufacturer in India | Radhika Copy House",
  },
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const { products } = await getCatalog();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      description: site.description,
      areaServed: "IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${site.url}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Home featuredProducts={products.slice(0, 4)} />
    </>
  );
}
