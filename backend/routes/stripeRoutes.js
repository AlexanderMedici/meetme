import express from "express";
import {
  createPaymentIntent,
  processTestPayment,
} from "../controllers/stripeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/test-payment", protect, processTestPayment);

export default router;
