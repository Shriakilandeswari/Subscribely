import Stripe from "stripe";
import { Payment } from "../models/paymentSchema.js";
import { UserPlan } from "../models/userPlans.js";
import { Plan } from "../models/plansSchema.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_KEY,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  switch (event.type) {
    /*
      SUCCESSFUL CHECKOUT
    */
    case "checkout.session.completed": {
      const session = data;

      const userId = session.metadata.userId;
      const planId = session.metadata.planId;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription,
      );

      const plan = await Plan.findById(planId);

      const userPlan = await UserPlan.create({
        userId,
        planId,
        stripeSubscriptionId: subscription.id,
        startDate: new Date(subscription.current_period_start * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
        status: "active",
      });

      await Payment.create({
        userId,
        userPlanId: userPlan._id,
        stripeCheckoutSessionId: session.id,
        amount: session.amount_total / 100,
        currency: session.currency,
        status: "paid",
      });

      break;
    }

    /*
      RECURRING PAYMENT SUCCESS
    */
    case "invoice.payment_succeeded": {
      const invoice = data;

      const subscriptionId = invoice.subscription;

      const userPlan = await UserPlan.findOne({
        stripeSubscriptionId: subscriptionId,
      });

      if (!userPlan) break;

      await Payment.create({
        userId: userPlan.userId,
        userPlanId: userPlan._id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: "paid",
      });

      break;
    }

    /*
      PAYMENT FAILED
    */
    case "invoice.payment_failed": {
      const invoice = data;

      const userPlan = await UserPlan.findOne({
        stripeSubscriptionId: invoice.subscription,
      });

      if (!userPlan) break;

      await Payment.create({
        userId: userPlan.userId,
        userPlanId: userPlan._id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
        status: "failed",
      });

      break;
    }

    /*
      SUBSCRIPTION CANCELLED
    */
    case "customer.subscription.deleted": {
      const subscription = data;

      await UserPlan.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { status: "cancelled" },
      );

      break;
    }
  }

  res.json({ received: true });
};
