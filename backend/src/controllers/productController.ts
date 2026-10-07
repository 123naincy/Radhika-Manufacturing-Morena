import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";

/* =====================================================
   CREATE PRODUCT
===================================================== */

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      slug,
      sku,
      description,
      category,
      brand,
      images,
      basePrice,
      moq,
      unit,
      stock,
      bulkPricing,
    } = req.body;

    if (
      !name ||
      !slug ||
      !sku ||
      !description ||
      !category ||
      basePrice === undefined ||
      moq === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "Required product fields are missing",
      });
      return;
    }

    const existingProduct = await Product.findOne({
      $or: [{ sku }, { slug }],
    });

    if (existingProduct) {
      res.status(400).json({
        success: false,
        message: "Product with this SKU or slug already exists",
      });
      return;
    }

    const product = await Product.create({
      name,
      slug,
      sku,
      description,
      category,
      brand,
      images: images || [],
      basePrice,
      moq,
      unit: unit || "piece",
      stock: stock || 0,
      bulkPricing: bulkPricing || [],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};


/* =====================================================
   GET ALL PRODUCTS
===================================================== */

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      brand,
      page = "1",
      limit = "12",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    const skip = (pageNumber - 1) * limitNumber;

    const filter: Record<string, any> = {
      isActive: true,
    };

    /* Search */

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: String(search),
            $options: "i",
          },
        },
        {
          sku: {
            $regex: String(search),
            $options: "i",
          },
        },
        {
          brand: {
            $regex: String(search),
            $options: "i",
          },
        },
      ];
    }

    /* Category */

    if (category) {
      filter.category = category;
    }

    /* Brand */

    if (brand) {
      filter.brand = {
        $regex: String(brand),
        $options: "i",
      };
    }

    /* Price */

    if (minPrice || maxPrice) {
      filter.basePrice = {};

      if (minPrice) {
        filter.basePrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.basePrice.$lte = Number(maxPrice);
      }
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};


/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const key = String(req.params.id || "");
    const isObjectId =
      mongoose.Types.ObjectId.isValid(key) && key.length === 24;

    const product = await Product.findOne(
      isObjectId
        ? { _id: key, isActive: true }
        : { slug: key, isActive: true }
    ).populate("category", "name slug");

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};
/* =====================================================
   DELETE PRODUCT
===================================================== */

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

/* =====================================================
   GET BULK PRICE
===================================================== */

export const getBulkPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { quantity } = req.query;

    const qty = Number(quantity);

    if (!qty || qty < 1) {
      res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
      return;
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    /* MOQ check */

    if (qty < product.moq) {
      res.status(400).json({
        success: false,
        message: `Minimum order quantity is ${product.moq}`,
        moq: product.moq,
      });
      return;
    }

    let price = product.basePrice;

    /*
      Find the highest applicable
      bulk pricing slab.
    */

    if (product.bulkPricing.length > 0) {
      const applicablePrices = product.bulkPricing
        .filter((slab) => {
          const minMatch = qty >= slab.minQuantity;

          const maxMatch =
            slab.maxQuantity === undefined ||
            qty <= slab.maxQuantity;

          return minMatch && maxMatch;
        })
        .sort((a, b) => b.minQuantity - a.minQuantity);

      if (applicablePrices.length > 0) {
        price = applicablePrices[0].price;
      }
    }

    res.status(200).json({
      success: true,
      productId: product._id,
      quantity: qty,
      unitPrice: price,
      totalPrice: price * qty,
      moq: product.moq,
    });
  } catch (error) {
    console.error("Bulk Price Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate bulk price",
    });
  }
};
export const getProductStats = async (
  _req: Request,
  res: Response
) => {
  try {
    const totalProducts =
      await Product.countDocuments({
        isActive: true,
      });

    return res.json({
      success: true,
      totalProducts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product stats",
    });
  }
};
export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};