import { Router } from "express";

import {
  loginAdmin,
  getCurrentAdmin,
} from "../controllers/authController";

const router = Router();

router.post(
  "/login",
  loginAdmin
);

router.get(
  "/me",
  getCurrentAdmin
);

export default router;