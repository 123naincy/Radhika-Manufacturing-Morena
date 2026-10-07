import { Suspense } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
