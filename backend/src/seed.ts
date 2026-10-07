import "dotenv/config";

import connectDB from "./config/db";
import Category from "./models/Category";
import Product from "./models/Product";

const categories = [
  {
    name: "School Copies",
    slug: "school-copies",
    description: "Ruled copies for schools, coaching centres and book sellers.",
  },
  {
    name: "Notebooks",
    slug: "notebooks",
    description: "Everyday notebooks for students, offices and retailers.",
  },
  {
    name: "Registers",
    slug: "registers",
    description: "Hard-bound registers for accounts, attendance and records.",
  },
  {
    name: "Long Books",
    slug: "long-books",
    description: "Long books for schools, colleges and bulk institutional orders.",
  },
  {
    name: "Drawing Books",
    slug: "drawing-books",
    description: "Drawing books with paper suited for school art work.",
  },
  {
    name: "Writing Pads",
    slug: "writing-pads",
    description: "Writing pads for offices, counters and professional use.",
  },
  {
    name: "Office Stationery",
    slug: "office-stationery",
    description: "Files, pads and daily stationery for offices and distributors.",
  },
];

const bulk = (price: number) => [
  {
    minQuantity: 100,
    maxQuantity: 499,
    price,
  },
  {
    minQuantity: 500,
    maxQuantity: 999,
    price: Number((price * 0.92).toFixed(2)),
  },
  {
    minQuantity: 1000,
    price: Number((price * 0.85).toFixed(2)),
  },
];

const products = [
  {
    name: "Single Line Copy 172 Pages",
    slug: "single-line-copy-172",
    sku: "RCH-SC-172",
    category: "school-copies",
    description:
      "172-page single line school copy with a firm cover, made for daily classroom use and carton-wise wholesale supply.",
    basePrice: 22,
    moq: 100,
    unit: "pc",
    stock: 8000,
  },
  {
    name: "Four Line Copy 172 Pages",
    slug: "four-line-copy-172",
    sku: "RCH-SC-4L172",
    category: "school-copies",
    description:
      "Four line copy for junior classes. Consistent ruling and binding for school and bookstore bulk orders.",
    basePrice: 22,
    moq: 100,
    unit: "pc",
    stock: 6000,
  },
  {
    name: "Soft Cover Notebook A5",
    slug: "soft-cover-notebook-a5",
    sku: "RCH-NB-A5",
    category: "notebooks",
    description:
      "A5 soft cover notebook for students and office counters. Supplied in bulk with manufacturer pricing.",
    basePrice: 28,
    moq: 80,
    unit: "pc",
    stock: 5000,
  },
  {
    name: "Long Notebook 200 Pages",
    slug: "long-notebook-200",
    sku: "RCH-NB-200",
    category: "notebooks",
    description:
      "200-page long notebook with durable binding for schools, coaching institutes and retailers.",
    basePrice: 42,
    moq: 60,
    unit: "pc",
    stock: 4000,
  },
  {
    name: "Account Register 192 Pages",
    slug: "account-register-192",
    sku: "RCH-RG-192",
    category: "registers",
    description:
      "Hard-bound account register for shops, offices and distributors who need a steady bulk supply.",
    basePrice: 85,
    moq: 40,
    unit: "pc",
    stock: 2500,
  },
  {
    name: "Attendance Register",
    slug: "attendance-register",
    sku: "RCH-RG-ATT",
    category: "registers",
    description:
      "Attendance register for schools, factories and offices. Printed ruling with a strong cover.",
    basePrice: 70,
    moq: 40,
    unit: "pc",
    stock: 2200,
  },
  {
    name: "Practical Long Book",
    slug: "practical-long-book",
    sku: "RCH-LB-PR",
    category: "long-books",
    description:
      "Practical long book for science and school projects, packed for institutional and wholesale orders.",
    basePrice: 48,
    moq: 50,
    unit: "pc",
    stock: 3000,
  },
  {
    name: "Plain Long Book 160 Pages",
    slug: "plain-long-book-160",
    sku: "RCH-LB-160",
    category: "long-books",
    description:
      "Plain long book for notes and classwork. Uniform size for easy carton packing and resale.",
    basePrice: 36,
    moq: 60,
    unit: "pc",
    stock: 3500,
  },
  {
    name: "Drawing Book 40 Pages",
    slug: "drawing-book-40",
    sku: "RCH-DB-40",
    category: "drawing-books",
    description:
      "40-page drawing book for school art classes. Smooth sheets and a cover suited to bulk retail.",
    basePrice: 30,
    moq: 80,
    unit: "pc",
    stock: 4000,
  },
  {
    name: "Sketch Book A4",
    slug: "sketch-book-a4",
    sku: "RCH-DB-A4",
    category: "drawing-books",
    description:
      "A4 sketch book for students and art retailers. Available on slab pricing for larger quantities.",
    basePrice: 55,
    moq: 40,
    unit: "pc",
    stock: 1800,
  },
  {
    name: "Office Writing Pad A4",
    slug: "office-writing-pad-a4",
    sku: "RCH-WP-A4",
    category: "writing-pads",
    description:
      "A4 writing pad for offices, banks and counters. Ruled sheets with a header block.",
    basePrice: 32,
    moq: 50,
    unit: "pc",
    stock: 3200,
  },
  {
    name: "Shorthand Pad",
    slug: "shorthand-pad",
    sku: "RCH-WP-SH",
    category: "writing-pads",
    description:
      "Shorthand pad for institutes and offices. Light, consistent ruling for daily professional use.",
    basePrice: 26,
    moq: 60,
    unit: "pc",
    stock: 2600,
  },
  {
    name: "Spring File",
    slug: "spring-file",
    sku: "RCH-OF-SF",
    category: "office-stationery",
    description:
      "Spring file for documents and student projects. A regular add-on for stationery wholesalers.",
    basePrice: 18,
    moq: 100,
    unit: "pc",
    stock: 7000,
  },
  {
    name: "Exam Board",
    slug: "exam-board",
    sku: "RCH-OF-EB",
    category: "office-stationery",
    description:
      "Exam writing board for schools and coaching centres. Supplied in bulk ahead of exam season.",
    basePrice: 24,
    moq: 80,
    unit: "pc",
    stock: 4500,
  },
];

const seed = async () => {
  await connectDB();

  const categoryIds = new Map<string, string>();

  for (const category of categories) {
    const saved = await Category.findOneAndUpdate(
      { slug: category.slug },
      { ...category, isActive: true },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    categoryIds.set(category.slug, String(saved._id));
  }

  let added = 0;

  for (const product of products) {
    const exists = await Product.findOne({
      $or: [{ slug: product.slug }, { sku: product.sku }],
    });

    if (exists) {
      continue;
    }

    await Product.create({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      category: categoryIds.get(product.category),
      brand: "Radhika",
      images: [],
      basePrice: product.basePrice,
      moq: product.moq,
      unit: product.unit,
      stock: product.stock,
      bulkPricing: bulk(product.basePrice),
      isActive: true,
    });

    added += 1;
  }

  console.log(
    `Catalogue ready. Added ${added} products across ${categories.length} categories.`
  );
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
