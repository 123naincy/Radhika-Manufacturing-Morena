import Link from "next/link";
import {
  ArrowRight,
  Factory,
  ShieldCheck,
  Truck,
  BadgeIndianRupee,
  CheckCircle2,
  Package,
} from "lucide-react";
import type { Product } from "../types/product";
import ProductCard from "../components/ProductCard";

const categories = [
  {
    title: "School Copies",
    slug: "school-copies",
    description: "Quality copies for schools and students",
    icon: "📚",
  },
  {
    title: "Notebooks",
    slug: "notebooks",
    description: "Reliable notebooks for everyday use",
    icon: "📓",
  },
  {
    title: "Registers",
    slug: "registers",
    description: "Strong registers for office and business use",
    icon: "📋",
  },
  {
    title: "Long Books",
    slug: "long-books",
    description: "Practical long books for bulk requirements",
    icon: "📖",
  },
  {
    title: "Drawing Books",
    slug: "drawing-books",
    description: "Smooth paper for drawing and creative work",
    icon: "🎨",
  },
  {
    title: "Writing Pads",
    slug: "writing-pads",
    description: "Professional writing pads for offices",
    icon: "📝",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Paper Selection",
    description:
      "Carefully selected paper for consistent quality and performance.",
  },
  {
    number: "02",
    title: "Printing",
    description:
      "Accurate printing with attention to clarity and finishing.",
  },
  {
    number: "03",
    title: "Cutting",
    description:
      "Precise cutting to maintain uniform size and shape.",
  },
  {
    number: "04",
    title: "Binding",
    description:
      "Strong binding designed for regular everyday use.",
  },
  {
    number: "05",
    title: "Quality Check",
    description:
      "Products are checked before moving to final packing.",
  },
  {
    number: "06",
    title: "Finished Product",
    description:
      "Ready-to-dispatch stationery prepared for bulk orders.",
  },
];

function Home({
  featuredProducts,
}: {
  featuredProducts: Product[];
}) {
  return (
    <div className="home-page">

      {/* =========================
          HERO
      ========================== */}

      <section className="home-hero">

        <div className="home-hero-container">

          <div className="home-hero-content">

            <span className="home-eyebrow">
              MANUFACTURER • WHOLESALER • BULK SUPPLIER
            </span>

            <h1>
              Quality Stationery,
              <span> Made for Business.</span>
            </h1>

            <p>
              Radhika Copy House manufactures quality stationery
              and paper products for schools, offices, retailers,
              distributors and businesses.
            </p>

            <div className="home-hero-buttons">

              <Link
                href="/products"
                className="home-primary-btn"
              >
                Explore Products
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/wholesale"
                className="home-secondary-btn"
              >
                Request Bulk Quote
              </Link>

            </div>

            <div className="home-trust-points">

              <div>
                <CheckCircle2 size={17} />
                Direct Manufacturer Pricing
              </div>

              <div>
                <CheckCircle2 size={17} />
                Bulk Order Support
              </div>

            </div>

          </div>


          {/* Hero Visual */}

          <div className="home-hero-visual">

            <div className="hero-main-card">

              <div className="hero-card-top">
                <span>RADHIKA</span>
                <span>EST. QUALITY</span>
              </div>

              <div className="hero-copy-stack">

                <div className="copy-book copy-book-back">
                  <span>NOTEBOOK</span>
                </div>

                <div className="copy-book copy-book-middle">
                  <span>REGISTER</span>
                </div>

                <div className="copy-book copy-book-front">

                  <small>RADHIKA</small>

                  <strong>
                    COPY
                    <br />
                    HOUSE
                  </strong>

                  <span>QUALITY STATIONERY</span>

                </div>

              </div>

              <div className="hero-card-bottom">
                <Package size={18} />
                <span>Bulk Stationery Solutions</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CATEGORIES
      ========================== */}

      <section className="home-section categories-section">

        <div className="home-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                OUR PRODUCT RANGE
              </span>

              <h2>
                Stationery for Every Requirement
              </h2>
            </div>

            <Link
              href="/products"
              className="section-link"
            >
              View All Products
              <ArrowRight size={17} />
            </Link>

          </div>


          <div className="category-grid">

            {categories.map((category) => (
              <div
                className="home-category-card"
                key={category.title}
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <h3>{category.title}</h3>

                <p>{category.description}</p>

                <Link href={`/products?category=${category.slug}`}>
                  Explore
                  <ArrowRight size={15} />
                </Link>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =========================
          WHY RADHIKA
      ========================== */}

      <section className="home-section why-section">

        <div className="home-container">

          <div className="why-grid">

            <div className="why-content">

              <span className="section-label">
                WHY RADHIKA COPY HOUSE
              </span>

              <h2>
                Built Around Quality,
                <span> Consistency & Scale.</span>
              </h2>

              <p>
                As a manufacturer, we focus on maintaining
                consistent product quality while supporting
                the requirements of businesses that purchase
                stationery in bulk.
              </p>

              <div className="why-list">

                <div className="why-item">
                  <div className="why-icon">
                    <Factory size={21} />
                  </div>

                  <div>
                    <h3>Direct Manufacturing</h3>
                    <p>
                      Products manufactured with direct
                      control over production and quality.
                    </p>
                  </div>
                </div>

                <div className="why-item">
                  <div className="why-icon">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <h3>Quality Focused</h3>
                    <p>
                      Quality checks throughout the
                      manufacturing process.
                    </p>
                  </div>
                </div>

                <div className="why-item">
                  <div className="why-icon">
                    <BadgeIndianRupee size={21} />
                  </div>

                  <div>
                    <h3>Competitive Bulk Pricing</h3>
                    <p>
                      Better pricing for larger quantities
                      and recurring requirements.
                    </p>
                  </div>
                </div>

                <div className="why-item">
                  <div className="why-icon">
                    <Truck size={21} />
                  </div>

                  <div>
                    <h3>Bulk Supply Support</h3>
                    <p>
                      Designed to serve retailers,
                      distributors, schools and businesses.
                    </p>
                  </div>
                </div>

              </div>

            </div>


            <div className="why-visual">

              <div className="factory-card">

                <Factory size={42} />

                <span>MANUFACTURING</span>

                <strong>
                  From Production
                  <br />
                  to Your Business
                </strong>

                <div className="factory-lines">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          MANUFACTURING PROCESS
      ========================== */}

      <section className="home-section process-section">

        <div className="home-container">

          <div className="section-heading centered">

            <span className="section-label">
              OUR MANUFACTURING PROCESS
            </span>

            <h2>
              Quality at Every Step
            </h2>

            <p>
              A structured production process helps us
              maintain consistency across every bulk order.
            </p>

          </div>


          <div className="process-grid">

            {processSteps.map((step) => (
              <div
                className="process-card"
                key={step.number}
              >

                <span className="process-number">
                  {step.number}
                </span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =========================
    FEATURED PRODUCTS
========================== */}

      <section className="home-section featured-products-section">

        <div className="home-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                FEATURED PRODUCTS
              </span>

              <h2>
                Popular Stationery Products
              </h2>
            </div>

            <Link
              href="/products"
              className="section-link"
            >
              View All Products
              <ArrowRight size={17} />
            </Link>

          </div>


          {/* Loading */}

          {featuredProducts.length > 0 ? (
              <div className="home-product-grid">

                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}

              </div>
            ) : (
              <div className="home-products-empty">

                <Package size={30} />

                <h3>
                  Products coming soon
                </h3>

                <p>
                  Our stationery collection is being updated.
                </p>

                <Link href="/products">
                  Explore Products
                  <ArrowRight size={16} />
                </Link>

              </div>
            )}

        </div>

      </section>
      {/* =========================
          BULK CTA
      ========================== */}

      <section className="bulk-home-cta">

        <div className="home-container">

          <div className="bulk-cta-inner">

            <div>

              <span className="section-label">
                HAVE A LARGE REQUIREMENT?
              </span>

              <h2>
                Need 500+ Pieces?
              </h2>

              <p>
                Tell us what you need and our team can
                prepare a customized bulk quotation for you.
              </p>

            </div>

            <Link
              href="/cart"
              className="bulk-cta-button"
            >
              Get a Bulk Quote
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;