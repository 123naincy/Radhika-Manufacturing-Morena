"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Tag,
} from "lucide-react";

import {
  getBulkPrice,
  submitQuoteRequest,
} from "../services/api";

import { useCart } from "../context/CartContext";

import type { Product } from "../types/product";

function ProductDetails({
  initialProduct,
}: {
  initialProduct: Product;
}) {
  const { addToCart } = useCart();
  const id = initialProduct._id;

  const [product] = useState<Product | null>(initialProduct);
  const [quantity, setQuantity] = useState(initialProduct.moq || 1);
  const [unitPrice, setUnitPrice] = useState(initialProduct.basePrice);
  const [totalPrice, setTotalPrice] = useState(
    initialProduct.basePrice * (initialProduct.moq || 1)
  );
  const [loading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [error] = useState("");
  const [added, setAdded] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  /* =========================
     LOAD PRODUCT
  ========================== */

  useEffect(() => {
    if (!product) return;

    const calculatePrice = async () => {
      if (quantity < product.moq) {
        setUnitPrice(product.basePrice);
        setTotalPrice(
          product.basePrice * quantity
        );

        return;
      }

      try {
        setPriceLoading(true);

        const response = await getBulkPrice(
          id,
          quantity
        );

        const price =
          response.unitPrice ??
          response.data?.unitPrice ??
          product.basePrice;

        const total =
          response.totalPrice ??
          response.data?.totalPrice ??
          price * quantity;

        setUnitPrice(price);
        setTotalPrice(total);
      } catch (err) {
        console.error(err);

        setUnitPrice(product.basePrice);
        setTotalPrice(
          product.basePrice * quantity
        );
      } finally {
        setPriceLoading(false);
      }
    };

    const timer = setTimeout(
      calculatePrice,
      250
    );

    return () => clearTimeout(timer);
  }, [quantity, product, id]);


  /* =========================
     QUANTITY
  ========================== */

  const increaseQuantity = () => {
    if (!product) return;

    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    if (!product) return;

    setQuantity((current) =>
      Math.max(product.moq || 1, current - 1)
    );
  };


  /* =========================
     BULK PRICING
  ========================== */

  const bulkPricing =
    useMemo(() => {
      if (!product?.bulkPricing) return [];

      return [...product.bulkPricing].sort(
        (a, b) =>
          a.minQuantity - b.minQuantity
      );
    }, [product]);


  /* =========================
     ADD TO CART
  ========================== */

  const handleAddToCart = () => {
    if (!product) return;

    if (quantity < product.moq) {
      alert(
        `Minimum order quantity is ${product.moq} ${product.unit}.`
      );

      setQuantity(product.moq);

      return;
    }

    try {
      addToCart(product, quantity);

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2500);
    } catch (err) {
      console.error(err);

      alert(
        "Unable to add product to cart."
      );
    }
  };

  const handleQuoteSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!product) return;

    try {
      setQuoteLoading(true);
      setQuoteError("");
      setQuoteSuccess(false);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();
      const company = String(
        formData.get("company") || ""
      ).trim();

      const phone = String(
        formData.get("phone") || ""
      ).trim();

      const email = String(
        formData.get("email") || ""
      ).trim();

      const gstNumber = String(
        formData.get("gstNumber") || ""
      ).trim();

      const city = String(
        formData.get("city") || ""
      ).trim();

      const message = String(
        formData.get("message") || ""
      ).trim();

      if (!name || !phone || !email) {
        setQuoteError(
          "Name, phone number and email are required."
        );
        return;
      }

      if (quantity < product.moq) {
        setQuoteError(
          `Minimum order quantity is ${product.moq} ${product.unit}${product.moq > 1 ? "s" : ""
          }.`
        );
        return;
      }

      const quoteData = {
        name,
        company,
        phone,
        email,
        gstNumber,
        city,
        message,

        products: [
          {
            productId: product._id,
            productName: product.name,
            quantity,
            unitPrice,
            totalPrice,
          },
        ],

        totalUnits: quantity,
        estimatedTotal: totalPrice,
      };

      await submitQuoteRequest(quoteData);

      setQuoteSuccess(true);

      form.reset();
    } catch (error) {
      console.error(error);

      setQuoteError(
        error instanceof Error
          ? error.message
          : "Failed to submit quote request."
      );
    } finally {
      setQuoteLoading(false);
    }
  };

  /* =========================
     LOADING
  ========================== */

  if (loading) {
    return (
      <div className="rd-loading-page">

        <div className="rd-spinner"></div>

        <p>
          Loading product...
        </p>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================== */

  if (error || !product) {
    return (
      <div className="rd-error-page">

        <Package size={42} />

        <h2>
          Product not found
        </h2>

        <p>
          {error ||
            "This product may have been removed."}
        </p>

        <Link href="/products">
          Back to Products
          <ArrowRight size={16} />
        </Link>

      </div>
    );
  }


  const image =
    product.images &&
      product.images.length > 0
      ? product.images[0]
      : "";


  return (
    <div className="product-details-page">

      {/* =========================
          BREADCRUMB
      ========================== */}

      <div className="rd-container">

        <div className="rd-breadcrumb">

          <Link href="/">
            Home
          </Link>

          <span>›</span>

          <Link href="/products">
            Products
          </Link>

          <span>›</span>

          <strong>
            {product.name}
          </strong>

        </div>

      </div>


      {/* =========================
          PRODUCT
      ========================== */}

      <section className="rd-product-section">

        <div className="rd-container">

          <div className="rd-product-grid">

            {/* IMAGE */}

            <div className="rd-image-column">

              <div className="rd-product-image-box">

                <button
                  type="button"
                  className="rd-wishlist"
                >
                  <Heart size={20} />
                </button>

                {image ? (
                  <img
                    src={image}
                    alt={product.name}
                  />
                ) : (
                  <div className="rd-image-placeholder">

                    <Package
                      size={75}
                      strokeWidth={1}
                    />

                    <span>
                      {product.name}
                    </span>

                  </div>
                )}

              </div>

              <div className="rd-image-note">
                <ShieldCheck size={15} />
                Quality checked product
              </div>

            </div>


            {/* DETAILS */}

            <div className="rd-info-column">

              <div className="rd-product-label">
                RADHIKA COPY HOUSE
              </div>

              <h1>
                {product.name}
              </h1>


              {/* SKU / BRAND */}

              <div className="rd-meta">

                <span>
                  SKU: {product.sku}
                </span>

                {product.brand && (
                  <>
                    <i></i>

                    <span>
                      Brand: {product.brand}
                    </span>
                  </>
                )}

              </div>


              {/* DESCRIPTION */}

              <p className="rd-description">
                {product.description}
              </p>


              {/* STOCK */}

              <div className="rd-stock-row">

                <span className="rd-stock">

                  <CheckCircle2 size={15} />

                  {product.stock > 0
                    ? "In Stock"
                    : "Out of Stock"}

                </span>

                <span>
                  MOQ: {product.moq}{" "}
                  {product.unit}
                  {product.moq > 1
                    ? "s"
                    : ""}
                </span>

              </div>


              {/* PRICE */}

              <div className="rd-price-box">

                <div className="rd-current-price">

                  ₹
                  {priceLoading
                    ? "..."
                    : unitPrice.toLocaleString(
                      "en-IN"
                    )}

                  <span>
                    / {product.unit}
                  </span>

                </div>

                <div className="rd-total-price">

                  Estimated Total:

                  <strong>
                    ₹
                    {totalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>


              {/* BULK PRICING */}

              {bulkPricing.length > 0 && (
                <div className="rd-bulk-section">

                  <div className="rd-section-title">

                    <Tag size={17} />

                    <span>
                      Bulk Pricing
                    </span>

                  </div>

                  <div className="rd-bulk-table">

                    {bulkPricing.map(
                      (tier, index) => {

                        const isActive =
                          quantity >=
                          tier.minQuantity &&
                          (!tier.maxQuantity ||
                            quantity <=
                            tier.maxQuantity);

                        return (
                          <div
                            key={index}
                            className={
                              isActive
                                ? "rd-bulk-row active"
                                : "rd-bulk-row"
                            }
                          >

                            <span>
                              {tier.minQuantity}
                              {tier.maxQuantity
                                ? ` - ${tier.maxQuantity}`
                                : "+"}{" "}
                              {product.unit}s
                            </span>

                            <strong>
                              ₹
                              {tier.price.toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              )}


              {/* QUANTITY */}

              <div className="rd-quantity-section">

                <div className="rd-section-title">
                  Quantity
                </div>

                <div className="rd-quantity-row">

                  <div className="rd-quantity-control">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                  <span className="rd-moq-note">
                    Minimum {product.moq}{" "}
                    {product.unit}
                    {product.moq > 1
                      ? "s"
                      : ""}
                  </span>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="rd-actions">

                <button
                  type="button"
                  className="rd-cart-btn"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    product.stock <= 0
                  }
                >

                  {added ? (
                    <>
                      <CheckCircle2 size={19} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart
                        size={19}
                      />
                      Add to Cart
                    </>
                  )}

                </button>

                <button
                  type="button"
                  className="rd-quote-btn"
                  onClick={() => {
                    setQuoteError("");
                    setQuoteSuccess(false);
                    setShowQuoteModal(true);
                  }}
                >
                  Request Bulk Quote
                  <ArrowRight size={17} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          SERVICE STRIP
      ========================== */}

      <section className="rd-service-section">

        <div className="rd-container">

          <div className="rd-service-grid">

            <div className="rd-service-item">

              <div>
                <Truck size={23} />
              </div>

              <span>
                <strong>
                  Bulk Supply
                </strong>

                Reliable supply for
                large requirements.
              </span>

            </div>


            <div className="rd-service-item">

              <div>
                <ShieldCheck size={23} />
              </div>

              <span>
                <strong>
                  Quality Assured
                </strong>

                Products checked
                before dispatch.
              </span>

            </div>


            <div className="rd-service-item">

              <div>
                <Package size={23} />
              </div>

              <span>
                <strong>
                  Manufacturer
                </strong>

                Direct manufacturer
                pricing.
              </span>

            </div>

          </div>

        </div>

      </section>
      {/* =========================
    DIRECT QUOTE MODAL
========================== */}

      {showQuoteModal && (
        <div
          className="pd-quote-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowQuoteModal(false);
            }
          }}
        >
          <div className="pd-quote-modal">

            {/* Header */}

            <div className="pd-quote-header">

              <div>
                <span>
                  BULK ENQUIRY
                </span>

                <h2>
                  Request a Quote
                </h2>

                <p>
                  Send your requirement directly to
                  Radhika Copy House.
                </p>
              </div>

              <button
                type="button"
                className="pd-quote-close"
                onClick={() =>
                  setShowQuoteModal(false)
                }
              >
                ×
              </button>

            </div>


            {quoteSuccess ? (

              /* =====================
                 SUCCESS
              ====================== */

              <div className="pd-quote-success">

                <div className="pd-success-icon">
                  <CheckCircle2 size={30} />
                </div>

                <h3>
                  Quote Request Submitted
                </h3>

                <p>
                  Your bulk requirement has been
                  received successfully.
                </p>

                <div className="pd-success-product">
                  <span>
                    {product.name}
                  </span>

                  <strong>
                    {quantity} {product.unit}
                    {quantity > 1 ? "s" : ""}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowQuoteModal(false)
                  }
                >
                  Done
                </button>

              </div>

            ) : (

              /* =====================
                 FORM
              ====================== */

              <form
                className="pd-quote-form"
                onSubmit={handleQuoteSubmit}
              >

                {/* Product summary */}

                <div className="pd-quote-product">

                  <div className="pd-quote-product-icon">
                    <Package size={22} />
                  </div>

                  <div className="pd-quote-product-info">

                    <span>
                      SELECTED PRODUCT
                    </span>

                    <strong>
                      {product.name}
                    </strong>

                    <small>
                      SKU: {product.sku}
                    </small>

                  </div>

                  <div className="pd-quote-product-price">

                    <strong>
                      ₹
                      {totalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <span>
                      Estimated
                    </span>

                  </div>

                </div>


                {/* Requirement */}

                <div className="pd-quote-section">

                  <div className="pd-quote-section-title">
                    Order Requirement
                  </div>

                  <div className="pd-quote-requirement">

                    <div>
                      <span>Quantity</span>

                      <strong>
                        {quantity} {product.unit}
                        {quantity > 1 ? "s" : ""}
                      </strong>
                    </div>

                    <div>
                      <span>Unit Price</span>

                      <strong>
                        ₹
                        {unitPrice.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Estimated Total</span>

                      <strong>
                        ₹
                        {totalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                  </div>

                </div>


                {/* Business details */}

                <div className="pd-quote-section">

                  <div className="pd-quote-section-title">
                    Business Information
                  </div>

                  <div className="pd-quote-grid">

                    <label className="pd-quote-field">

                      <span>
                        Name *
                      </span>

                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                      />

                    </label>


                    <label className="pd-quote-field">

                      <span>
                        Company
                      </span>

                      <input
                        type="text"
                        name="company"
                        placeholder="Company name"
                      />

                    </label>


                    <label className="pd-quote-field">

                      <span>
                        Phone *
                      </span>

                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />

                    </label>


                    <label className="pd-quote-field">

                      <span>
                        Email *
                      </span>

                      <input
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        required
                      />

                    </label>


                    <label className="pd-quote-field">

                      <span>
                        GST Number
                      </span>

                      <input
                        type="text"
                        name="gstNumber"
                        placeholder="GSTIN (optional)"
                      />

                    </label>


                    <label className="pd-quote-field">

                      <span>
                        City
                      </span>

                      <input
                        type="text"
                        name="city"
                        placeholder="Your city"
                      />

                    </label>

                  </div>

                </div>


                {/* Message */}

                <div className="pd-quote-section">

                  <label className="pd-quote-field">

                    <span>
                      Additional Requirement
                    </span>

                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us about customization, delivery, packaging or other requirements..."
                    />

                  </label>

                </div>


                {/* Error */}

                {quoteError && (
                  <div className="pd-quote-error">
                    {quoteError}
                  </div>
                )}


                {/* Bottom */}

                <div className="pd-quote-footer">

                  <div>
                    <span>
                      Estimated Order Value
                    </span>

                    <strong>
                      ₹
                      {totalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <button
                    type="submit"
                    disabled={quoteLoading}
                    className="pd-quote-submit"
                  >
                    {quoteLoading
                      ? "Submitting..."
                      : "Submit Quote Request"}

                    {!quoteLoading && (
                      <ArrowRight size={17} />
                    )}
                  </button>

                </div>

              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;