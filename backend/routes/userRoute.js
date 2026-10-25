import express from "express";
import { checkAccessToken } from "../middleware/checkAccessToken.js";
import { getCurrentPlan } from "../controller/plan_controller.js";

const router = express.Router();

router.get("/current-plan", checkAccessToken, getCurrentPlan);

export default router;
