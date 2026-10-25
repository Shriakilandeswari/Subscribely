import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/`,
    session: false,
  }),
  (req, res) => {
    const token = req.authInfo?.accessToken;
    const IdToken = req.authInfo?.idToken;
    console.log("access token", token);
    console.log("ID token", IdToken);

    if (!token) {
      return res.redirect(`${process.env.CLIENT_URL}/`);
    }

    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${IdToken}`);
  },
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // remove session cookie
      res.json({ message: "Logged out successfully" });
    });
  });
});

export default router;
