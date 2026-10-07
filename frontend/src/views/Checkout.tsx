"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";

import Link from "next/link";

import { createOrder } from "../services/api";

import { useCart } from "../context/CartContext";

function Checkout() {
  const {
    cartItems,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


    const handleSubmit = async (
        e: FormEvent
    ) => {
        e.preventDefault();

        if (!cartItems.length) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await createOrder({
                    customer: {
                        name: form.name,
                        company: form.company,
                        phone: form.phone,
                        email: form.email,
                        gstNumber: form.gstNumber,
                    },

                    shippingAddress: {
                        address: form.address,
                        city: form.city,
                        state: form.state,
                        pincode: form.pincode,
                    },

                    items: cartItems.map(
                        (item) => ({
                            productId:
                                item.product._id,

                            quantity:
                                item.quantity,
                        })
                    ),

                    paymentMethod: "pending",

                    notes: form.notes,
                });

            setOrderNumber(
                response.order.orderNumber
            );

            clearCart();

        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to place order"
            );
        } finally {
            setLoading(false);
        }
    };


    /* =========================
       EMPTY
    ========================== */

    if (!cartItems.length && !orderNumber) {
        return (
            <div className="checkout-empty">

                <Package size={45} />

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add products before checkout.
                </p>

                <Link href="/products">
                    Browse Products
                    <ArrowRight size={16} />
                </Link>

            </div>
        );
    }


    /* =========================
       SUCCESS
    ========================== */

    if (orderNumber) {
        return (
            <div className="checkout-success">

                <div className="checkout-success-icon">
                    <CheckCircle2 size={38} />
                </div>

                <span>
                    ORDER PLACED
                </span>

                <h1>
                    Thank You!
                </h1>

                <p>
                    Your order request has been
                    successfully submitted.
                </p>

                <div className="checkout-order-number">
                    <small>
                        Order Number
                    </small>

                    <strong>
                        {orderNumber}
                    </strong>
                </div>

                <p className="checkout-followup">
                    Our team will contact you shortly
                    to confirm your order and payment
                    details.
                </p>

                <Link
                    href="/products"
                    className="checkout-success-btn"
                >
                    Continue Shopping
                    <ArrowRight size={17} />
                </Link>

            </div>
        );
    }


    return (
        <div className="checkout-page">

            <div className="checkout-container">

                {/* Header */}

                <div className="checkout-header">

                    <Link href="/cart">
                        <ArrowLeft size={16} />
                        Back to Cart
                    </Link>

                    <h1>
                        Checkout
                    </h1>

                    <span>
                        {cartCount} units
                    </span>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="checkout-grid"
                >

                    {/* =====================
              CUSTOMER
          ====================== */}

                    <div className="checkout-main">

                        <section className="checkout-card">

                            <div className="checkout-card-title">

                                <User size={18} />

                                <div>
                                    <h2>
                                        Customer Information
                                    </h2>

                                    <p>
                                        Tell us how we can contact you.
                                    </p>
                                </div>

                            </div>


                            <div className="checkout-fields">

                                <label>
                                    Full Name *
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        required
                                    />
                                </label>

                                <label>
                                    Company Name
                                    <input
                                        name="company"
                                        value={form.company}
                                        onChange={handleChange}
                                        placeholder="Company name"
                                    />
                                </label>

                                <label>
                                    Phone *
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+91 XXXXX XXXXX"
                                        required
                                    />
                                </label>

                                <label>
                                    Email *
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="name@company.com"
                                        required
                                    />
                                </label>

                                <label>
                                    GST Number
                                    <input
                                        name="gstNumber"
                                        value={form.gstNumber}
                                        onChange={handleChange}
                                        placeholder="GSTIN"
                                    />
                                </label>

                            </div>

                        </section>


                        {/* Address */}

                        <section className="checkout-card">

                            <div className="checkout-card-title">

                                <MapPin size={18} />

                                <div>
                                    <h2>
                                        Delivery Address
                                    </h2>

                                    <p>
                                        Where should we deliver your order?
                                    </p>
                                </div>

                            </div>


                            <div className="checkout-fields">

                                <label className="checkout-full">
                                    Address *
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="House / Office / Street address"
                                        required
                                    />
                                </label>

                                <label>
                                    City *
                                    <input
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        required
                                    />
                                </label>

                                <label>
                                    State *
                                    <input
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        required
                                    />
                                </label>

                                <label>
                                    Pincode *
                                    <input
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        placeholder="6 digit pincode"
                                        required
                                    />
                                </label>

                            </div>

                        </section>


                        {/* Notes */}

                        <section className="checkout-card">

                            <div className="checkout-card-title">

                                <Package size={18} />

                                <div>
                                    <h2>
                                        Additional Notes
                                    </h2>
                                </div>

                            </div>

                            <textarea
                                className="checkout-notes"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Any delivery, packaging or customization requirements..."
                                rows={4}
                            />

                        </section>

                    </div>


                    {/* =====================
              SUMMARY
          ====================== */}

                    <aside className="checkout-summary">

                        <div className="checkout-summary-card">

                            <h2>
                                Order Summary
                            </h2>


                            <div className="checkout-items">

                                {cartItems.map((item) => (
                                    <div
                                        className="checkout-item"
                                        key={item.product._id}
                                    >

                                        <div>

                                            <strong>
                                                {item.product.name}
                                            </strong>

                                            <span>
                                                {item.quantity} × ₹
                                                {item.unitPrice}
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


                            <div className="checkout-total">

                                <span>
                                    Total Units
                                </span>

                                <strong>
                                    {cartCount}
                                </strong>

                            </div>

                            <div className="checkout-total final">

                                <span>
                                    Estimated Total
                                </span>

                                <strong>
                                    ₹
                                    {cartTotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            {error && (
                                <div className="checkout-error">
                                    {error}
                                </div>
                            )}


                            <button
                                type="submit"
                                className="checkout-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Placing Order..."
                                    : "Place Order"}

                                {!loading && (
                                    <ArrowRight size={17} />
                                )}
                            </button>


                            <div className="checkout-contact">

                                <Phone size={15} />

                                Need help?

                                <a href="tel:+917355469354">
                                    Contact us
                                </a>

                            </div>

                        </div>

                    </aside>

                </form>

            </div>

        </div>
    );
}

export default Checkout;