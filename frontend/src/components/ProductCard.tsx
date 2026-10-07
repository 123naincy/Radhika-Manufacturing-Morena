"use client";

import {
  ArrowRight,
  ShoppingCart,
  Package,
} from "lucide-react";

import { useState } from "react";
import Link from "next/link";

import { useCart } from "../context/CartContext";

import type { Product } from "../types/product";

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, product.moq || 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const image =
    product.images &&
    product.images.length > 0
      ? product.images[0]
      : "";

  const firstBulkPrice =
    product.bulkPricing &&
    product.bulkPricing.length > 0
      ? product.bulkPricing[0].price
      : product.basePrice;

  const hasBulkPricing =
    product.bulkPricing &&
    product.bulkPricing.length > 1;

  return (
    <article className="rch-product-card">

      {/* =========================
          IMAGE AREA
      ========================== */}

      <div className="rch-product-image-area">

        {hasBulkPricing && (
          <span className="rch-product-badge">
            Bulk Price
          </span>
        )}

        {image ? (
          <img
            src={image}
            alt={product.name}
            className="rch-product-image"
          />
        ) : (
          <div className="rch-product-placeholder">
            <Package size={45} strokeWidth={1.3} />

            <span>
              Stationery
            </span>
          </div>
        )}

      </div>


      {/* =========================
          CONTENT
      ========================== */}

      <div className="rch-product-content">

        <Link
          href={`/products/${product.slug || product._id}`}
          className="rch-product-title"
        >
          {product.name}
        </Link>


        <div className="rch-product-sku">
          SKU: {product.sku}
        </div>


        {product.brand && (
          <div className="rch-product-brand">
            {product.brand}
          </div>
        )}


        {/* Price */}

        <div className="rch-product-price-row">

          <strong>
            ₹{firstBulkPrice}
          </strong>

          <span>
            / {product.unit}
          </span>

        </div>


        {/* MOQ */}

        <div className="rch-product-moq">

          <Package size={14} />

          <span>
            MOQ: {product.moq}{" "}
            {product.unit}
            {product.moq > 1 ? "s" : ""}
          </span>

        </div>


        {/* Bulk pricing */}

        {hasBulkPricing && (
          <div className="rch-product-bulk-text">
            Better pricing on larger quantities
          </div>
        )}


        {/* Add to cart */}

        <button
          type="button"
          className="rch-product-cart-btn"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={17} />

          <span>
            {added ? "Added" : "Add to Cart"}
          </span>
        </button>


        {/* Details */}

        <Link
          href={`/products/${product.slug || product._id}`}
          className="rch-product-details"
        >
          View Details

          <ArrowRight size={15} />
        </Link>

      </div>

    </article>
  );
}

export default ProductCard;