import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import Providers from "@/components/Providers";
import { site } from "@/lib/site";
import "./store.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Wholesale Stationery Manufacturer in India",
    template: "%s | Radhika Copy House",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "wholesale stationery",
    "notebook manufacturer India",
    "school copy wholesale",
    "register supplier",
    "bulk stationery",
    "Radhika Copy House",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "business",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: "Radhika Copy House | Wholesale Stationery Manufacturer",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Radhika Copy House | Wholesale Stationery Manufacturer",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${dmSans.variable} ${manrope.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
