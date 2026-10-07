"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageSquare,
  Package,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";

import {
  submitQuoteRequest,
} from "../services/api";

const Cart = () => {
  const [showQuoteForm, setShowQuoteForm] =
    useState(false);

  const [quoteLoading, setQuoteLoading] =
    useState(false);

  const [quoteSuccess, setQuoteSuccess] =
    useState(false);

  const [quoteError, setQuoteError] =
    useState("");

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">

        <div className="empty-cart">

          <div className="empty-cart-icon">
            <ShoppingBag size={48} strokeWidth={1.4} />
          </div>

          <h1>Your Cart is Empty</h1>

          <p>
            Add products to your cart to start your
            bulk order.
          </p>

          <Link
            href="/products"
            className="primary-btn"
          >
            <ArrowLeft size={18} />
            Browse Products
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="cart-page">

      {/* Header */}
      <section className="cart-header">

        <div>
          <span>RADHIKA COPY HOUSE</span>
          <h1>Your Cart</h1>
          <p>
            Review your products and bulk order
            quantities.
          </p>
        </div>

        <Link
          href="/products"
          className="continue-shopping"
        >
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>

      </section>

      <div className="cart-layout">

        {/* Cart Items */}
        <section className="cart-items">

          {cartItems.map((item) => {

            const product = item.product;

            const itemTotal = item.totalPrice;

            return (
              <article
                className="cart-item"
                key={product._id}
              >

                {/* Image */}
                <div className="cart-item-image">

                  {product.images &&
                    product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                    />
                  ) : (
                    <Package
                      size={40}
                      strokeWidth={1.3}
                    />
                  )}

                </div>

                {/* Details */}
                <div className="cart-item-details">

                  <span className="cart-item-brand">
                    {product.brand || "RADHIKA"}
                  </span>

                  <Link
                    href={`/products/${product.slug || product._id}`}
                  >
                    <h3>{product.name}</h3>
                  </Link>

                  <p>
                    SKU: {product.sku}
                  </p>

                  <span className="cart-item-price">
                    ₹{item.unitPrice} / {product.unit}
                  </span>

                </div>

                {/* Quantity */}
                <div className="cart-quantity">

                  <span>Quantity</span>

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          product._id,
                          Math.max(
                            product.moq,
                            item.quantity - 1
                          )
                        )
                      }
                      disabled={
                        item.quantity <= product.moq
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <strong>
                      {item.quantity}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          product._id,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                  <small>
                    MOQ: {product.moq}
                  </small>

                </div>

                {/* Total */}
                <div className="cart-item-total">

                  <strong>
                    ₹
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() =>
                      removeFromCart(product._id)
                    }
                    aria-label="Remove product"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </article>
            );
          })}

          <button
            className="clear-cart"
            type="button"
            onClick={clearCart}
          >
            <Trash2 size={16} />
            Clear Cart
          </button>

        </section>

        {/* Order Summary */}
        <aside className="cart-summary">

          <div className="summary-card">

            <h2>Order Summary</h2>

            <div className="summary-line">
              <span>Products</span>
              <strong>
                {cartItems.length}
              </strong>
            </div>

            <div className="summary-line">
              <span>Total Units</span>
              <strong>
                {cartItems.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Estimated Total</span>

              <strong>
                ₹
                {cartTotal.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>

            <p className="summary-note">
              Final pricing may vary based on
              applicable bulk pricing and quotation.
            </p>

            <button
              type="button"
              className="quote-cart-btn"
              onClick={() => setShowQuoteForm(true)}
            >
              <MessageSquare size={19} />
              Request Bulk Quote
            </button>

           <Link
  href="/checkout"
  className="cart-checkout-btn"
>
  Place Order
  <ArrowRight size={17} />
</Link>

          </div>

          {/* Manufacturer Info */}
          <div className="manufacturer-note">

            <Package size={21} />

            <div>
              <strong>
                Direct Manufacturer Pricing
              </strong>

              <p>
                Large quantity orders may qualify
                for additional pricing benefits.
              </p>
            </div>

          </div>

        </aside>

      </div>
      {showQuoteForm && (
        <div
          className="quote-modal-overlay"
          onClick={() => {
            if (!quoteLoading) {
              setShowQuoteForm(false);
              setQuoteError("");
            }
          }}
        >
          <div
            className="quote-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE */}
            <button
              type="button"
              className="quote-modal-close"
              onClick={() => {
                if (!quoteLoading) {
                  setShowQuoteForm(false);
                  setQuoteError("");
                }
              }}
              disabled={quoteLoading}
            >
              <X size={20} />
            </button>

            {/* HEADER */}
            <div className="quote-modal-header">
              <span>RADHIKA COPY HOUSE</span>

              <h2>Request Bulk Quote</h2>

              <p>
                Share your business details and our team
                will contact you with the best bulk pricing.
              </p>
            </div>

            {/* SUCCESS */}
            {quoteSuccess ? (
              <div className="quote-success">

                <div className="quote-success-icon">
                  ✓
                </div>

                <h3>
                  Quote Request Submitted!
                </h3>

                <p>
                  Thank you for your enquiry. Our team
                  will contact you shortly with your
                  customized quotation.
                </p>

                <button
                  type="button"
                  className="quote-success-btn"
                  onClick={() => {
                    setShowQuoteForm(false);
                    setQuoteSuccess(false);
                  }}
                >
                  Continue Shopping
                </button>

              </div>
            ) : (
              <form
                className="quote-form"
                onSubmit={async (e) => {
                  e.preventDefault();

                  const form =
                    e.currentTarget;

                  const formData =
                    new FormData(form);

                  const name =
                    String(
                      formData.get("name") || ""
                    ).trim();

                  const company =
                    String(
                      formData.get("company") || ""
                    ).trim();

                  const phone =
                    String(
                      formData.get("phone") || ""
                    ).trim();

                  const email =
                    String(
                      formData.get("email") || ""
                    ).trim();

                  const gstNumber =
                    String(
                      formData.get("gstNumber") || ""
                    ).trim();

                  const city =
                    String(
                      formData.get("city") || ""
                    ).trim();

                  const message =
                    String(
                      formData.get("message") || ""
                    ).trim();

                  if (!name) {
                    alert("Please enter your name");
                    return;
                  }

                  if (!phone) {
                    alert(
                      "Please enter your phone number"
                    );
                    return;
                  }

                  if (!email) {
                    alert(
                      "Please enter your email"
                    );
                    return;
                  }

                  if (cartItems.length === 0) {
                    alert("Your cart is empty");
                    return;
                  }

                  try {
                    setQuoteLoading(true);
                    setQuoteError("");

                    const products =
                      cartItems.map((item) => ({
                        productId:
                          item.product._id,

                        productName:
                          item.product.name,

                        quantity:
                          item.quantity,

                        unitPrice:
                          item.unitPrice,

                        totalPrice:
                          item.totalPrice,
                      }));

                    const totalUnits =
                      cartItems.reduce(
                        (total, item) =>
                          total + item.quantity,
                        0
                      );

                    const estimatedTotal =
                      cartItems.reduce(
                        (total, item) =>
                          total + item.totalPrice,
                        0
                      );

                    await submitQuoteRequest({
                      name,
                      company,
                      phone,
                      email,
                      gstNumber,
                      city,
                      message,
                      products,
                      totalUnits,
                      estimatedTotal,
                    });

                    setQuoteSuccess(true);

                  } catch (error) {
                    console.error(error);

                    setQuoteError(
                      error instanceof Error
                        ? error.message
                        : "Unable to submit request. Please try again."
                    );

                  } finally {
                    setQuoteLoading(false);
                  }
                }}
              >

                {/* CUSTOMER DETAILS */}
                <div className="quote-form-section">

                  <div className="quote-section-heading">
                    <span>01</span>

                    <div>
                      <h3>
                        Business Information
                      </h3>

                      <p>
                        Tell us about yourself and your
                        business requirement.
                      </p>
                    </div>
                  </div>

                  <div className="quote-form-grid">

                    <div className="quote-field">
                      <label>
                        Full Name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="quote-field">
                      <label>
                        Company / Business Name
                      </label>

                      <input
                        type="text"
                        name="company"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div className="quote-field">
                      <label>
                        Phone Number *
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>

                    <div className="quote-field">
                      <label>
                        Email Address *
                      </label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="quote-field">
                      <label>
                        GST Number
                        <span>Optional</span>
                      </label>

                      <input
                        type="text"
                        name="gstNumber"
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>

                    <div className="quote-field">
                      <label>
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                      />
                    </div>

                  </div>

                </div>


                {/* REQUIREMENT */}
                <div className="quote-form-section">

                  <div className="quote-section-heading">
                    <span>02</span>

                    <div>
                      <h3>
                        Additional Requirement
                      </h3>

                      <p>
                        Tell us about customization,
                        delivery or other requirements.
                      </p>
                    </div>
                  </div>

                  <div className="quote-field">

                    <label>
                      Message / Requirement
                    </label>

                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us about your quantity, customization, delivery location, printing requirement, etc."
                    />

                  </div>

                </div>


                {/* SUMMARY */}
                <div className="quote-form-section">

                  <div className="quote-section-heading">
                    <span>03</span>

                    <div>
                      <h3>
                        Quote Summary
                      </h3>

                      <p>
                        Products included in your enquiry.
                      </p>
                    </div>
                  </div>

                  <div className="quote-products-summary">

                    {cartItems.map((item) => (
                      <div
                        className="quote-product-row"
                        key={item.product._id}
                      >

                        <div>
                          <strong>
                            {item.product.name}
                          </strong>

                          <span>
                            {item.quantity}{" "}
                            {item.product.unit}
                            {" × "}
                            ₹{item.unitPrice}
                          </span>
                        </div>

                        <strong>
                          ₹
                          {item.totalPrice.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>
                    ))}

                  </div>

                  <div className="quote-summary">

                    <div>
                      <span>
                        Products
                      </span>

                      <strong>
                        {cartItems.length}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total Units
                      </span>

                      <strong>
                        {cartItems.reduce(
                          (total, item) =>
                            total + item.quantity,
                          0
                        )}
                      </strong>
                    </div>

                    <div className="quote-summary-total">
                      <span>
                        Estimated Value
                      </span>

                      <strong>
                        ₹
                        {cartTotal.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                  </div>

                  <p className="quote-disclaimer">
                    Final quotation may vary depending on
                    quantity, customization, delivery location
                    and applicable commercial terms.
                  </p>

                </div>


                {/* ERROR */}
                {quoteError && (
                  <div className="quote-error">
                    {quoteError}
                  </div>
                )}


                {/* SUBMIT */}
                <button
                  type="submit"
                  className="quote-submit-btn"
                  disabled={quoteLoading}
                >
                  <MessageSquare size={18} />

                  {quoteLoading
                    ? "Submitting Request..."
                    : "Submit Quote Request"}
                </button>

                <p className="quote-trust-text">
                  🔒 Your information is secure and will
                  only be used to process your quotation.
                </p>

              </form>
            )}

          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;