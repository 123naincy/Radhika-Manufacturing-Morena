import Link from "next/link";
import EnquiryForm from "../components/EnquiryForm";

const terms = [
  {
    title: "Minimum order",
    text: "Each product has its own MOQ. Larger slabs unlock a lower unit price.",
  },
  {
    title: "Quote first",
    text: "Catalogue rates are ex-factory indicators. The confirmed quote includes packing and the delivery city.",
  },
  {
    title: "GST invoice",
    text: "Share a valid GST number if you need a tax invoice for your books.",
  },
  {
    title: "Dispatch",
    text: "Orders move after confirmation. Schools and seasonal buyers should book ahead of term opening.",
  },
];

function Wholesale() {
  return (
    <div className="site-page">
      <section className="site-hero">
        <div className="site-container">
          <p className="site-eyebrow">WHOLESALE & DISTRIBUTORS</p>
          <h1>Stock Radhika stationery in your market.</h1>
          <p>
            Booksellers, school suppliers and regional distributors
            can buy direct. Add products to the cart for a priced
            quote, or send your range here.
          </p>
          <Link href="/products" className="site-primary">
            Open catalogue
          </Link>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <div className="wholesale-grid">
            {terms.map((item) => (
              <article key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="wholesale-form-wrap">
            <h2>Distributor enquiry</h2>
            <EnquiryForm
              enquiryType="wholesale"
              submitLabel="Request dealer pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Wholesale;
