import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModel.js";
import { Plan } from "../models/plansSchema.js";
import { UserPlan } from "../models/userPlans.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email", "openid"],
    },
    async (accessToken, refreshToken, params, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
          });

          // assign Basic plan only when user is created
          const basicPlan = await Plan.findOne({ planName: "Basic" });

          if (basicPlan) {
            await UserPlan.create({
              userId: user._id,
              planId: basicPlan._id,
              state: "active",
            });
          }
        }

        // 👇 pass accessToken so it becomes req.authInfo.accessToken
        return done(null, user, { accessToken, idToken: params.id_token });
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

// only needed if you use sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
