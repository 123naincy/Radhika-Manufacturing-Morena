import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getBulkPrice,
  getProductStats,
} from "../controllers/productController";
import { protectAdmin } from "../middleware/authMiddleware";
const router = Router();

router.get("/stats/count", getProductStats);
router.get("/", getProducts);
router.get("/:id/bulk-price", getBulkPrice);
router.get("/:id", getProductById);
router.post(
  "/",
  protectAdmin,
  createProduct
);

router.put(
  "/:id",
  protectAdmin,
  updateProduct
);

router.delete(
  "/:id",
  protectAdmin,
  deleteProduct
);

export default router;