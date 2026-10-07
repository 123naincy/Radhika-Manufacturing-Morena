"use client";

import {
    Search,
    Menu,
    X,
    ChevronDown,
    ShoppingCart,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { cartCount } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname, searchParams]);

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        const value = query.trim();

        router.push(
            value
                ? `/products?q=${encodeURIComponent(value)}`
                : "/products"
        );
    };

    return (
        <>
            <div className="top-strip">
                <div className="container">
                    <p>
                        Manufacturer of Quality Stationery & Paper Products
                    </p>

                    <div className="top-links">
                        <Link href="/wholesale">Wholesale Orders</Link>
                        <Link href="/wholesale">Become a Distributor</Link>
                    </div>
                </div>
            </div>

            <header className="main-header">
                <div className="container header-inner">
                    <Link href="/" className="brand">
                        <div className="brand-mark">R</div>

                        <div className="brand-text">
                            <strong>RADHIKA</strong>
                            <span>COPY HOUSE</span>
                        </div>
                    </Link>

                    <form className="header-search" onSubmit={submitSearch}>
                        <Search size={20} />

                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search products, notebooks, copies..."
                        />

                        <button type="submit">Search</button>
                    </form>

                    <div className="header-actions">
                        <Link href="/wholesale" className="header-action">
                            <div>
                                <small>Dealers</small>
                                <span>Wholesale</span>
                            </div>
                        </Link>

                        <Link href="/cart" className="header-action cart-action header-cart">
                            <ShoppingCart size={21} />

                            {cartCount > 0 && (
                                <span className="cart-count-badge">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            className="mobile-menu"
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                        >
                            {menuOpen ? <X size={25} /> : <Menu size={25} />}
                        </button>
                    </div>
                </div>

                <nav className={`main-nav ${menuOpen ? "mobile-open" : ""}`}>
                    <div className="container nav-inner">
                        <form className="nav-search" onSubmit={submitSearch}>
                            <Search size={18} />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search stationery..."
                            />
                            <button type="submit">Search</button>
                        </form>

                        <Link href="/products" className="category-menu">
                            <Menu size={19} />
                            All Products
                            <ChevronDown size={16} />
                        </Link>

                        <Link href="/products?category=notebooks">Copies & Notebooks</Link>
                        <Link href="/products?category=registers">Registers</Link>
                        <Link href="/products?category=writing-pads">Writing Pads</Link>
                        <Link href="/products?category=school-copies">School Stationery</Link>
                        <Link href="/products?category=office-stationery">Office Stationery</Link>
                        <Link href="/about">About Radhika</Link>
                        <Link href="/contact">Contact</Link>

                        <Link href="/wholesale" className="bulk-link">
                            Bulk Enquiry
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;
