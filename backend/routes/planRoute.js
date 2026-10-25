import express from "express";
import { Plan } from "../models/plansSchema.js";
import { checkAccessToken } from "../middleware/checkAccessToken.js";
import { getPdf, getCurrentPlan } from "../controller/plan_controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
});

router.get("/pdf/:id", checkAccessToken, getPdf);
router.get("/current-plan", checkAccessToken, getCurrentPlan);

export default router;
