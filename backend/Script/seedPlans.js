import { Plan } from "../models/plansSchema.js";
import mongoose from "mongoose";
await mongoose.connect("mongodb://localhost:27017/SASS");

await Plan.insertMany([
  {
    planName: "Basic",
    price: 0,
    stripePriceId: "price_1T6RIqP7H3UduyGEtiEUzwJC",
    features: ["PDF1, PDF2"],
  },
  {
    planName: "Premium",
    price: 10,
    stripePriceId: "price_1T6RJNP7H3UduyGEy9NfGm42",
    features: ["PDF1", "PDF2", "PDF3", "PDF4"],
  },
]);

console.log("Plans inserted");
process.exit();
