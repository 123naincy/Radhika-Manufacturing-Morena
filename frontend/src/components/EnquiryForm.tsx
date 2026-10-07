"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitQuoteRequest } from "../services/api";

type EnquiryFormProps = {
  enquiryType: "contact" | "wholesale";
  submitLabel: string;
};

const emptyForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  city: "",
  gstNumber: "",
  message: "",
};

function EnquiryForm({
  enquiryType,
  submitLabel,
}: EnquiryFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Name, phone and email are required.");
      return;
    }

    try {
      setLoading(true);

      await submitQuoteRequest({
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        gstNumber: form.gstNumber.trim(),
        message: form.message.trim(),
        products: [],
        totalUnits: 0,
        estimatedTotal: 0,
        enquiryType,
      });

      setSent(true);
      setForm(emptyForm);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not send your enquiry"
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="enquiry-success">
        <CheckCircle2 size={28} />
        <div>
          <strong>Enquiry received</strong>
          <p>
            Our wholesale desk will contact you on the
            phone or email you shared.
          </p>
          <button type="button" onClick={() => setSent(false)}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <label>
        Full name
        <input
          name="name"
          value={form.name}
          onChange={(event) =>
            setForm({ ...form, name: event.target.value })
          }
          required
        />
      </label>

      <label>
        Business name
        <input
          name="company"
          value={form.company}
          onChange={(event) =>
            setForm({ ...form, company: event.target.value })
          }
          placeholder="Shop, school or company"
        />
      </label>

      <label>
        Phone
        <input
          name="phone"
          value={form.phone}
          onChange={(event) =>
            setForm({ ...form, phone: event.target.value })
          }
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={(event) =>
            setForm({ ...form, email: event.target.value })
          }
          required
        />
      </label>

      <label>
        City
        <input
          name="city"
          value={form.city}
          onChange={(event) =>
            setForm({ ...form, city: event.target.value })
          }
        />
      </label>

      <label>
        GST number
        <input
          name="gstNumber"
          value={form.gstNumber}
          onChange={(event) =>
            setForm({ ...form, gstNumber: event.target.value })
          }
          placeholder="Optional"
        />
      </label>

      <label className="enquiry-full">
        Requirement
        <textarea
          name="message"
          rows={5}
          value={form.message}
          onChange={(event) =>
            setForm({ ...form, message: event.target.value })
          }
          placeholder="Products, quantity, delivery city and any printing requirement"
        />
      </label>

      {error && <p className="enquiry-error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}

export default EnquiryForm;
