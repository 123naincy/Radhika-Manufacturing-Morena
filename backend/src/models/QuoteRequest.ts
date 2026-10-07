import mongoose, { Schema, Document } from "mongoose";

export interface IQuoteRequest extends Document {
  name: string;
  company?: string;
  phone: string;
  email: string;
  message?: string;
  gstNumber?: string;
  city?: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];

  totalUnits: number;
  estimatedTotal: number;
  enquiryType?: "cart" | "contact" | "wholesale";

  status: "pending" | "contacted" | "quoted" | "completed";

  createdAt: Date;
  updatedAt: Date;
}

const quoteRequestSchema = new Schema<IQuoteRequest>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    message: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    city: {
      type: String,
      trim: true,
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },

        productName: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        unitPrice: {
          type: Number,
          required: true,
        },

        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],

    totalUnits: {
      type: Number,
      required: true,
    },

    estimatedTotal: {
      type: Number,
      required: true,
    },

    enquiryType: {
      type: String,
      enum: ["cart", "contact", "wholesale"],
      default: "cart",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "contacted",
        "quoted",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuoteRequest>(
  "QuoteRequest",
  quoteRequestSchema
);