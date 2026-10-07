import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";


/* =========================
   CREATE ORDER
========================= */

export const createOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
      notes,
      paymentMethod,
    } = req.body;

    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.email
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name, phone and email are required",
      });
    }

    if (
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete shipping address is required",
      });
    }

    if (!items || !Array.isArray(items) || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }


    /* =========================
       VERIFY PRODUCTS
    ========================== */

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(
        item.productId
      );

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message:
            `Product not available: ${item.productId}`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < product.moq) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name} minimum quantity is ${product.moq}`,
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message:
            `Insufficient stock for ${product.name}`,
        });
      }


      /* Find applicable bulk price */

      let unitPrice = product.basePrice;

      for (const tier of product.bulkPricing || []) {
        if (
          quantity >= tier.minQuantity &&
          (
            tier.maxQuantity === undefined ||
            quantity <= tier.maxQuantity
          )
        ) {
          unitPrice = tier.price;
        }
      }

      const totalPrice =
        unitPrice * quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        quantity,
        unitPrice,
        totalPrice,
      });
    }


    /* =========================
       TOTALS
    ========================== */

    const totalUnits =
      orderItems.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );

    const subtotal =
      orderItems.reduce(
        (sum, item) =>
          sum + item.totalPrice,
        0
      );


    /* =========================
       ORDER NUMBER
    ========================== */

    const orderNumber =
      `RCH-${Date.now()}`;


    /* =========================
       CREATE
    ========================== */

    const order = await Order.create({
      orderNumber,

      customer,

      shippingAddress,

      items: orderItems,

      totalUnits,

      subtotal,

      paymentMethod:
        paymentMethod || "pending",

      paymentStatus: "pending",

      status: "pending",

      notes,
    });


    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};


/* =========================
   GET ORDERS
========================= */

export const getOrders = async (
  _req: Request,
  res: Response
) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


/* =========================
   GET SINGLE ORDER
========================= */

export const getOrderById = async (
  req: Request,
  res: Response
) => {
  try {
    const order =
      await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};


/* =========================
   UPDATE ORDER STATUS
========================= */

export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status",
    });
  }
};
export const getOrderStats = async (
  _req: Request,
  res: Response
) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      orderValue,
    ] = await Promise.all([
      Order.countDocuments(),

      Order.countDocuments({
        status: "pending",
      }),

      Order.countDocuments({
        status: "processing",
      }),

      Order.countDocuments({
        status: "shipped",
      }),

      Order.countDocuments({
        status: "delivered",
      }),

      Order.countDocuments({
        status: "cancelled",
      }),

      Order.aggregate([
        {
          $match: {
            status: {
              $ne: "cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$subtotal",
            },
          },
        },
      ]),
    ]);

    const totalOrderValue =
      orderValue.length > 0
        ? orderValue[0].total
        : 0;

    return res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalOrderValue,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
    });
  }
};