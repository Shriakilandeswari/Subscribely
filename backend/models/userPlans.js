import mongoose from "mongoose";

const userPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
  stripeSubscriptionId: { type: String },
  status: {
    type: String,
    enum: ["active", "cancelled", "expired"],
    default: "active",
  },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  cancelAtPeriodEnd: { type: Date },
});

export const UserPlan = mongoose.model("UserPlan", userPlanSchema);
