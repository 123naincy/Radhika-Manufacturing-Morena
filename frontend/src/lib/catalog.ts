import type { Category } from "../services/api";
import type { Product } from "../types/product";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getCatalog(): Promise<{
  products: Product[];
  categories: Category[];
}> {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(`${API_URL}/products?limit=100`, { cache: "no-store" }),
      fetch(`${API_URL}/categories`, { cache: "no-store" }),
    ]);

    if (!productsResponse.ok || !categoriesResponse.ok) {
      return { products: [], categories: [] };
    }

    const productsJson = await productsResponse.json();
    const categoriesJson = await categoriesResponse.json();

    return {
      products: productsJson.products || [],
      categories: categoriesJson.categories || [],
    };
  } catch (error) {
    console.error("Catalogue fetch failed:", error);
    return { products: [], categories: [] };
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/products/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.product || null;
  } catch (error) {
    console.error("Product fetch failed:", error);
    return null;
  }
}
