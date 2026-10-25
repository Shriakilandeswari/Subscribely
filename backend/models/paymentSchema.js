import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "UserPlan" },
  stripePaymentIntentId: { type: String },
  stripeInvoiceId: { type: String },
  stripeCheckoutSessionId: { type: String },
  amount: { type: Number },
  currency: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Payment = mongoose.model("Payment", paymentSchema);
