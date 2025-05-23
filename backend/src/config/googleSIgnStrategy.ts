import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL,
} from "./env";

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
            callbackURL: GOOGLE_REDIRECT_URL,
            passReqToCallback: true,
        },
        async function (req, accessToken, refreshToken, profile, done) {
            try {
                const state = req.query.state;
                const email = profile._json.email;

                const mode = new URLSearchParams(state?.toString()).get("mode");
                const role =
                    new URLSearchParams(state?.toString()).get("role") || "";

                console.log(role);

                const existingUser = await User.findOne({ email });

                if (mode === "register") {
                    if (existingUser) {
                        return done(null, existingUser);
                    }

                    const newUser = await User.create({
                        name: profile.displayName,
                        email,
                        role: role || "candidate",
                        profilePicture: profile._json.picture,
                        isVerified: true,
                        isAvailableForHire: role === "candidate",
                        isOAuthUser: true,
                        password: "oauth_dummy_password",
                    });

                    return done(null, newUser);
                }

                if (mode === "login") {
                    if (existingUser) {
                        return done(null, existingUser);
                    }

                    const newUser = await User.create({
                        name: profile.displayName,
                        email,
                        role: role || "candidate",
                        profilePicture: profile._json.picture,
                        isVerified: true,
                        isAvailableForHire: role === "candidate",
                        isOAuthUser: true,
                        password: "oauth_dummy_password",
                    });

                    return done(null, newUser);
                }

                return done(
                    new Error("Invalid mode. Expected 'register' or 'login'."),
                    false
                );
            } catch (err) {
                return done(err as Error);
            }
        }
    )
);
