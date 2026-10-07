import type { Metadata } from "next";
import Contact from "@/views/Contact";

export const metadata: Metadata = {
  title: "Contact the Wholesale Desk",
  description:
    "Request a bulk stationery quote from Radhika Copy House. Call +91 73554 69354 or send your quantity, city and GST details.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}
