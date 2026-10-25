import express from "express";
import {
  createCheckoutSession,
  verifySession,
  successPage,
  cancelPage,
  createBillingPortal,
} from "../controller/billing_controller.js";
import { checkAccessToken } from "../middleware/checkAccessToken.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  checkAccessToken,
  createCheckoutSession,
);
router.post("/verify-session", checkAccessToken, verifySession);
router.get("/success", successPage);
router.get("/cancel", cancelPage);
router.get("/customers/:customerId", checkAccessToken, createBillingPortal);

export default router;
