"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  PackageOpen,
} from "lucide-react";

import ProductCard from "../components/ProductCard";

import type { Product } from "../types/product";
import type { Category } from "../services/api";



function Products({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
}) {
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [loading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sortBy, setSortBy] = useState("default");

  const search = searchParams.get("q") ?? "";
  const categorySlug = searchParams.get("category") ?? "";

  const selectedCategory = useMemo(() => {
    if (!categorySlug) {
      return "";
    }

    const match = categories.find(
      (category) =>
        category.slug === categorySlug ||
        category._id === categorySlug
    );

    return match?._id ?? "";
  }, [categories, categorySlug]);

  const updateParams = (
    updates: Record<string, string>
  ) => {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const setSearch = (value: string) => {
    updateParams({ q: value });
  };

  const setSelectedCategory = (id: string) => {
    const category = categories.find(
      (item) => item._id === id
    );

    updateParams({
      category: category?.slug || "",
    });
  };

  /* =========================
     FILTER + SEARCH + SORT
  ========================== */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* Search */

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((product) => {
        const categoryName =
          typeof product.category === "object"
            ? product.category?.name
            : "";

        return (
          product.name
            ?.toLowerCase()
            .includes(searchValue) ||
          product.sku
            ?.toLowerCase()
            .includes(searchValue) ||
          product.brand
            ?.toLowerCase()
            .includes(searchValue) ||
          product.description
            ?.toLowerCase()
            .includes(searchValue) ||
          categoryName
            ?.toLowerCase()
            .includes(searchValue)
        );
      });
    }

    /* Category */

    if (selectedCategory) {
      result = result.filter((product) => {
        const categoryId =
          typeof product.category === "object"
            ? product.category?._id
            : product.category;

        return categoryId === selectedCategory;
      });
    }

    /* Sorting */

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => a.basePrice - b.basePrice
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => b.basePrice - a.basePrice
      );
    }

    if (sortBy === "name-az") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "name-za") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    sortBy,
  ]);

  const hasFilters =
    search !== "" ||
    selectedCategory !== "" ||
    sortBy !== "default";

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
    setSortBy("default");
  };

  return (
    <div className="products-page">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <section className="products-hero">

  <div className="products-container">

    <div className="products-breadcrumb">
      <Link href="/">Home</Link>
      <span>›</span>
      <strong>Products</strong>
    </div>

    <div className="products-hero-content">

      <div>
        <span className="products-eyebrow">
          RADHIKA COPY HOUSE
        </span>

        <h1>
          Stationery <span>Catalogue</span>
        </h1>

        <p>
          Explore our range of quality stationery products
          available for wholesale and bulk requirements.
        </p>

        <div className="products-benefits">

          <div className="products-benefit">
            <span>✓</span>
            <div>
              <strong>Wide Range</strong>
              <small>All stationery essentials</small>
            </div>
          </div>

          <div className="products-benefit">
            <span>₹</span>
            <div>
              <strong>Competitive Pricing</strong>
              <small>Best rates for bulk orders</small>
            </div>
          </div>

          <div className="products-benefit">
            <span>✓</span>
            <div>
              <strong>Bulk Supply</strong>
              <small>Reliable order support</small>
            </div>
          </div>

        </div>
      </div>

      <div className="products-hero-visual">

        <div className="hero-book hero-book-one">
          NOTEBOOK
        </div>

        <div className="hero-book hero-book-two">
          REGISTER
        </div>

        <div className="hero-book hero-book-three">
          <small>RADHIKA</small>
          <strong>
            QUALITY
            <br />
            STATIONERY
          </strong>
        </div>

      </div>

    </div>

  </div>

</section>


      {/* =========================
          PRODUCTS AREA
      ========================== */}

      <section className="products-section">

        <div className="products-container">

          {/* Toolbar */}

          <div className="products-toolbar">

            <div className="products-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search products, SKU or brand..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

            </div>


            <div className="products-toolbar-right">

              <div className="products-sort">

                <SlidersHorizontal size={16} />

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                >
                  <option value="default">
                    Sort: Default
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="name-az">
                    Name: A to Z
                  </option>

                  <option value="name-za">
                    Name: Z to A
                  </option>
                </select>

              </div>

            </div>

          </div>


          {/* =========================
              CATEGORY FILTER
          ========================== */}

          <div className="category-filter">

            <button
              className={
                selectedCategory === ""
                  ? "category-filter-btn active"
                  : "category-filter-btn"
              }
              onClick={() =>
                setSelectedCategory("")
              }
            >
              All Products
            </button>

            {categories
              .filter((category) => category.isActive)
              .map((category) => (
                <button
                  key={category._id}
                  className={
                    selectedCategory === category._id
                      ? "category-filter-btn active"
                      : "category-filter-btn"
                  }
                  onClick={() =>
                    setSelectedCategory(category._id)
                  }
                >
                  {category.name}
                </button>
              ))}

          </div>


          {/* =========================
              RESULT HEADER
          ========================== */}

          <div className="products-result-header">

            <div>
              <strong>
                {filteredProducts.length}
              </strong>

              <span>
                {" "}
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}
              </span>
            </div>

            {hasFilters && (
              <button
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear Filters
                <X size={14} />
              </button>
            )}

          </div>


          {/* =========================
              LOADING
          ========================== */}

          {loading && (
            <div className="products-loading">

              <div className="products-spinner"></div>

              <p>
                Loading products...
              </p>

            </div>
          )}


          {/* =========================
              PRODUCT GRID
          ========================== */}

          {!loading &&
            filteredProducts.length > 0 && (
              <div className="products-grid">

                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}

              </div>
            )}


          {/* =========================
              EMPTY STATE
          ========================== */}

          {!loading &&
            filteredProducts.length === 0 && (
              <div className="products-empty">

                <div className="products-empty-icon">
                  <PackageOpen size={32} />
                </div>

                <h2>
                  No products found
                </h2>

                <p>
                  Try changing your search or
                  category filters.
                </p>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="products-empty-btn"
                  >
                    Clear Filters
                  </button>
                )}

              </div>
            )}

        </div>

      </section>

    </div>
  );
}

export default Products;