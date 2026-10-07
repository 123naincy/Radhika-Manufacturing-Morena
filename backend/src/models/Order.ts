import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  orderNumber: string;

  customer: {
    name: string;
    company?: string;
    phone: string;
    email: string;
    gstNumber?: string;
  };

  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  items: IOrderItem[];

  totalUnits: number;
  subtotal: number;

  paymentMethod: "cod" | "online" | "pending";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema =
  new Schema<IOrderItem>(
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      productName: {
        type: String,
        required: true,
        trim: true,
      },

      sku: {
        type: String,
        required: true,
        trim: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    { _id: false }
  );

const orderSchema =
  new Schema<IOrder>(
    {
      orderNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      customer: {
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

        gstNumber: {
          type: String,
          trim: true,
          uppercase: true,
        },
      },

      shippingAddress: {
        address: {
          type: String,
          required: true,
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        state: {
          type: String,
          required: true,
          trim: true,
        },

        pincode: {
          type: String,
          required: true,
          trim: true,
        },
      },

      items: {
        type: [orderItemSchema],
        required: true,
        validate: {
          validator: (items: IOrderItem[]) =>
            items.length > 0,
          message: "Order must contain at least one item",
        },
      },

      totalUnits: {
        type: Number,
        required: true,
        min: 1,
      },

      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      paymentMethod: {
        type: String,
        enum: ["cod", "online", "pending"],
        default: "pending",
      },

      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },

      status: {
        type: String,
        enum: [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],
        default: "pending",
      },

      notes: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IOrder>(
  "Order",
  orderSchema
);