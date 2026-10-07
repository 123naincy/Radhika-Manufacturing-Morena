import { Mail, MapPin, Phone } from "lucide-react";
import EnquiryForm from "../components/EnquiryForm";

function Contact() {
  return (
    <div className="site-page">
      <section className="site-hero">
        <div className="site-container">
          <p className="site-eyebrow">CONTACT</p>
          <h1>Talk to the wholesale desk.</h1>
          <p>
            Send your quantity, city and GST details. We reply with
            availability and a bulk price.
          </p>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container contact-layout">
          <div className="contact-card">
            <h2>Radhika Copy House</h2>
            <p>Manufacturer and wholesaler of paper stationery.</p>

            <a href="tel:+917355469354">
              <Phone size={18} />
              +91 73554 69354
            </a>
            <a href="mailto:info@radhikacopyhouse.com">
              <Mail size={18} />
              info@radhikacopyhouse.com
            </a>
            <div>
              <MapPin size={18} />
              <span>Supplying across India</span>
            </div>
          </div>

          <EnquiryForm
            enquiryType="contact"
            submitLabel="Send enquiry"
          />
        </div>
      </section>
    </div>
  );
}

export default Contact;
