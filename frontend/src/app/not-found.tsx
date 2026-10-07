import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main>
        <div className="site-page">
          <section className="site-hero">
            <div className="site-container">
              <p className="site-eyebrow">404</p>
              <h1>This page is not in the catalogue.</h1>
              <p>The link may be old. The product list is still open.</p>
              <Link href="/products" className="site-primary">
                Browse products
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
