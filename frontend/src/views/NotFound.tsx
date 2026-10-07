import Link from "next/link";

function NotFound() {
  return (
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
  );
}

export default NotFound;
