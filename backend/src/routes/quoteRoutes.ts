import { Router } from "express";

import {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteStatus,
} from "../controllers/quoteController";

import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  createQuoteRequest
);

router.get(
  "/",
  protectAdmin,
  getQuoteRequests
);

router.put(
  "/:id/status",
  protectAdmin,
  updateQuoteStatus
);

export default router;