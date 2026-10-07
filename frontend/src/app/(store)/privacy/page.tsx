import type { Metadata } from "next";
import Legal from "@/views/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Radhika Copy House uses enquiry and order details shared by wholesale buyers.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <Legal kind="privacy" />;
}
