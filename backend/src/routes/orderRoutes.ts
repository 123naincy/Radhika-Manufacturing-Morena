import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/orderController";

import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();
// Customer
router.post(
  "/",
  createOrder
);

// Admin
router.get(
  "/stats",
  protectAdmin,
  getOrderStats
);

router.get(
  "/",
  protectAdmin,
  getOrders
);

router.get(
  "/:id",
  protectAdmin,
  getOrderById
);

router.put(
  "/:id/status",
  protectAdmin,
  updateOrderStatus
);

export default router;