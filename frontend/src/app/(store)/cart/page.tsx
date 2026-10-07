import type { Metadata } from "next";
import Cart from "@/views/Cart";

export const metadata: Metadata = {
  title: "Bulk Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <Cart />;
}
