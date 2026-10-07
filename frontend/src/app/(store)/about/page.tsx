import type { Metadata } from "next";
import About from "@/views/About";

export const metadata: Metadata = {
  title: "About the Manufacturer",
  description:
    "Radhika Copy House is a stationery manufacturer and wholesaler supplying notebooks, copies and registers to retailers, schools and distributors.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <About />;
}
