import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBulkPrice {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;

  category: Types.ObjectId;

  brand?: string;

  images: string[];

  basePrice: number;

  moq: number;

  unit: string;

  stock: number;

  bulkPricing: IBulkPrice[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const bulkPriceSchema = new Schema<IBulkPrice>(
  {
    minQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    maxQuantity: {
      type: Number,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    moq: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    unit: {
      type: String,
      required: true,
      default: "piece",
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    bulkPricing: {
      type: [bulkPriceSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;