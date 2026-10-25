import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
export const createCheckoutSession = async (req, res) => {
  console.log("hey there", req);
  const user = req.user;

  try {
    console.log(req.body);
    const { price } = req.body;
    console.log("price", price);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      metadata: {
        userId: user._id,
      },
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    console.log("session", session);

    res.json({ url: session.url });
  } catch (error) {
    console.log("Stripe Error:", error);
    res.status(500).json({ error });
  }
};

// Verify checkout session
export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log("Session id of the payment done now.");

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("retrieve the payment status based on session Id", session);

    if (session.payment_status === "paid") {
      return res.json({ success: true });
    }

    res.json({ success: false });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// Success handler
export const successPage = async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).send("Invalid session_id");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  console.log(session);

  res.send("Subscribed successfully");
};

// Cancel handler
export const cancelPage = async (req, res) => {
  res.redirect("/");
};

// Customer billing portal
export const createBillingPortal = async (req, res) => {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: req.params.customerId,
    return_url: `${process.env.CLIENT_URL}/app/`,
  });

  res.json({ url: portalSession.url });
};
