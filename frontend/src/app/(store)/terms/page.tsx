import type { Metadata } from "next";
import Legal from "@/views/Legal";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Wholesale terms for Radhika Copy House orders, including catalogue prices, minimum quantities, GST and dispatch.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <Legal kind="terms" />;
}
