function Legal({ kind }: { kind: "privacy" | "terms" }) {
  const isPrivacy = kind === "privacy";

  return (
    <div className="site-page">
      <section className="site-hero">
        <div className="site-container">
          <p className="site-eyebrow">RADHIKA COPY HOUSE</p>
          <h1>{isPrivacy ? "Privacy Policy" : "Terms & Conditions"}</h1>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container legal-copy">
          {isPrivacy ? (
            <>
              <p>
                Enquiry and order forms collect your name, phone,
                email, business name, city and GST number so the
                wholesale desk can reply and invoice you.
              </p>
              <p>
                These details are used for quotes, orders and
                dispatch. They are not sold. Admin access is limited
                to the Radhika Copy House team.
              </p>
              <p>
                To update or remove a enquiry, write to
                info@radhikacopyhouse.com or call +91 73554 69354.
              </p>
            </>
          ) : (
            <>
              <p>
                Catalogue prices are wholesale indicators in Indian
                rupees and can change with paper cost and quantity.
                An order is confirmed only after the desk accepts
                the quote.
              </p>
              <p>
                Minimum order quantities apply. GST is charged as
                applicable when a GST number is provided. Delivery
                timelines depend on the city and the production queue.
              </p>
              <p>
                Title of goods passes after payment terms agreed on
                the confirmed order are met.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Legal;
