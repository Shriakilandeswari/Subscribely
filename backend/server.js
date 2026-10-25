import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import planRoute from "./routes/planRoute.js";
import userRoute from "./routes/userRoute.js";
import billingRoutes from "./routes/billingRoutes.js";
import { stripeWebhook } from "./controller/stripe_webhook_controller.js";

import "./config/passport.js";

dotenv.config();

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json());

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/plans", planRoute);
app.use("/user", userRoute);
app.use("/billing", billingRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
