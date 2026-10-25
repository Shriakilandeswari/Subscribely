import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  planName: { type: String },
  price: { type: Number },
  stripePriceId: { type: String },
  features: { type: [String] },
  createAt: { type: Date, default: Date.now },
});

export const Plan = mongoose.model("Plan", planSchema);
