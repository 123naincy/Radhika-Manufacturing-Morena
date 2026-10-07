import type { Metadata } from "next";
import Wholesale from "@/views/Wholesale";

export const metadata: Metadata = {
  title: "Wholesale and Distributor Enquiry",
  description:
    "Become a Radhika Copy House stockist. Minimum order quantities, GST invoices and manufacturer pricing for booksellers and regional distributors.",
  alternates: { canonical: "/wholesale" },
};

export default function WholesalePage() {
  return <Wholesale />;
}
