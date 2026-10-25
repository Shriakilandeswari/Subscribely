import { Plan } from "../models/plansSchema.js";
import { UserPlan } from "../models/userPlans.js";
import { User } from "../models/userModel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import path from "path";

export const getPdf = async (req, res) => {
  try {
    console.log("filename", __filename);
    console.log("dirname", __dirname);

    console.log("inside the get PDF");
    const pdfId = Number(req.params.id);
    console.log("pdf id", pdfId);
    const user = req.user;
    console.log("user in get pdf", user);
    const fetchedUser = await User.findOne({ email: user.email });
    console.log("user in get pdf", fetchedUser);
    const userPlan = await UserPlan.findOne({
      userId: fetchedUser._id,
    });
    console.log("user plan", userPlan);

    const plan = await Plan.findOne({ _id: userPlan.planId });
    console.log("plan choosen features", plan.features);

    if (!plan.features.includes("PDF" + pdfId)) {
      return res.status(403).json({
        message: "Upgrade required",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(path.resolve(__dirname, "../pdfs", `${pdfId}.pdf`));
  } catch (error) {
    res.status(500).json({ message: "Error fetching PDF" });
  }
};

export const getCurrentPlan = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  const userPlan = await UserPlan.findOne({ userId: user._id });

  res.json({ planId: userPlan.planId });
};
