import Link from "next/link";
import { Factory, ShieldCheck, Truck } from "lucide-react";

function About() {
  return (
    <div className="site-page">
      <section className="site-hero">
        <div className="site-container">
          <p className="site-eyebrow">ABOUT RADHIKA COPY HOUSE</p>
          <h1>A stationery manufacturer for wholesale buyers.</h1>
          <p>
            Radhika Copy House makes notebooks, school copies,
            registers, long books, drawing books and writing pads
            for retailers, distributors, schools and offices that
            buy in bulk.
          </p>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container site-split">
          <div>
            <h2>Made for repeat bulk orders</h2>
            <p>
              Paper selection, printing, cutting, binding and packing
              stay in one production flow so size, ruling and finish
              stay consistent from carton to carton.
            </p>
            <p>
              Wholesale prices move with quantity. Share your
              requirement and the desk confirms the slab, packing
              and dispatch before the order is final.
            </p>
            <Link href="/wholesale" className="site-primary">
              Become a stockist
            </Link>
          </div>

          <div className="site-points">
            <div>
              <Factory size={22} />
              <div>
                <strong>Direct from the factory</strong>
                <span>No retail markup on bulk quantities.</span>
              </div>
            </div>
            <div>
              <ShieldCheck size={22} />
              <div>
                <strong>Checked before dispatch</strong>
                <span>Binding, ruling and packing are reviewed.</span>
              </div>
            </div>
            <div>
              <Truck size={22} />
              <div>
                <strong>Carton supply</strong>
                <span>Packed for shops, schools and distributors.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
