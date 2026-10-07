import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Globe,
  Camera,
  BriefcaseBusiness,
} from "lucide-react";



function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">

      {/* =========================
          CTA SECTION
      ========================== */}

      <div className="footer-cta">

        <div className="footer-cta-content">

          <div>
            <span className="footer-cta-label">
              BULK & WHOLESALE ORDERS
            </span>

            <h2>
              Need stationery in bulk?
            </h2>

            <p>
              Get direct manufacturer pricing for schools,
              offices, retailers, distributors and businesses.
            </p>
          </div>

          <Link
            href="/wholesale"
            className="footer-quote-btn"
          >
            Request a Quote
            <ArrowUpRight size={18} />
          </Link>

        </div>

      </div>


      {/* =========================
          MAIN FOOTER
      ========================== */}

      <div className="footer-main">

        <div className="footer-container">

          {/* Brand */}

          <div className="footer-brand">

            <Link
              href="/"
              className="footer-logo"
            >
              <div className="footer-logo-box">
                RC
              </div>

              <div>
                <strong>Radhika</strong>
                <span>Copy House</span>
              </div>
            </Link>

            <p>
              Manufacturer of quality stationery and paper
              products for schools, offices, retailers,
              distributors and businesses.
            </p>

            <div className="footer-socials">

              <a href="#" aria-label="Facebook">
                <Globe size={17} />
              </a>

              <a href="#" aria-label="Instagram">
                <Camera size={17} />
              </a>

              <a href="#" aria-label="LinkedIn">
                <BriefcaseBusiness size={17} />
              </a>

            </div>

          </div>


          {/* Quick Links */}

          <div className="footer-column">

            <h3>Quick Links</h3>

            <Link href="/">
              Home
            </Link>

            <Link href="/products">
              Products
            </Link>

            <Link href="/about">
              About
            </Link>

            <Link href="/contact">
              Contact
            </Link>

            <Link href="/wholesale">
              Wholesale
            </Link>

          </div>


          {/* Products */}

          <div className="footer-column">

            <h3>Our Products</h3>

            <Link href="/products?category=school-copies">School Copies</Link>
            <Link href="/products?category=notebooks">Notebooks</Link>
            <Link href="/products?category=registers">Registers</Link>
            <Link href="/products?category=long-books">Long Books</Link>
            <Link href="/products?category=drawing-books">Drawing Books</Link>
            <Link href="/products?category=writing-pads">Writing Pads</Link>

          </div>


          {/* Contact */}

          <div className="footer-column footer-contact">

            <h3>Contact Us</h3>

            <div className="footer-contact-item">

              <MapPin size={18} />

              <span>
                India
              </span>

            </div>

            <div className="footer-contact-item">

              <Phone size={18} />

              <a href="tel:+917355469354">
                +91 73554 69354
              </a>

            </div>

            <div className="footer-contact-item">

              <Mail size={18} />

              <a href="mailto:info@radhikacopyhouse.com">
                info@radhikacopyhouse.com
              </a>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          BOTTOM BAR
      ========================== */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {currentYear} Radhika Copy House.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <Link href="/privacy">
              Privacy Policy
            </Link>

            <Link href="/terms">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;