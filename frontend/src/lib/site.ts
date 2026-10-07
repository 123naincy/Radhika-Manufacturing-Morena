export const site = {
  name: "Radhika Copy House",
  description:
    "Radhika Copy House manufactures and wholesales notebooks, school copies, registers, long books, drawing books and office stationery for retailers, schools and distributors across India.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+917355469354",
  phoneDisplay: "+91 73554 69354",
  email: "info@radhikacopyhouse.com",
};

export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}
