import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function checkAccessToken(req, res, next) {
  try {
    console.log("Authorization header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    console.log("Received token:", token);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("Ticket verified");

    const payload = ticket.getPayload();

    console.log("Payload:", payload);

    req.user = payload;

    next();
  } catch (error) {
    console.log("Verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
