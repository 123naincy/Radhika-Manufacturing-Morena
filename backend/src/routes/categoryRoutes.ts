import { Router } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protectAdmin } from "../middleware/authMiddleware";
const router = Router();

router.post(
  "/",
  protectAdmin,
  createCategory
);

router.get(
  "/",
  getCategories
);

router.get(
  "/:id",
  getCategoryById
);

router.put(
  "/:id",
  protectAdmin,
  updateCategory
);

router.delete(
  "/:id",
  protectAdmin,
  deleteCategory
);

export default router;