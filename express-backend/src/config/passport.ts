import passport, { type DoneCallback } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model";

export interface UserProfile {
  sub: string,
  name: string,
  given_name: string,
  family_name: string,
  picture: string,
  email: string,
  email_verified: boolean
}

passport.serializeUser((user: any, done: DoneCallback) => {
  done(null, user._id);
});
passport.deserializeUser(async (id: string, done: DoneCallback) => {
  try {
    const currentUser = await User.findById(id);
    return done(null, currentUser);
  } catch (error) {
    return done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userProfile: UserProfile = profile._json as UserProfile;
        
        // Check for existing user by googleId or email
        const existingUser = await User.findOne({
          $or: [
            { googleId: userProfile.sub },
            { email: userProfile.email }
          ]
        });
        
        if (existingUser) {
          // Update googleId if user exists but doesn't have it
          if (!existingUser.googleId) {
            existingUser.googleId = userProfile.sub;
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        // Create new user
        const user = new User({
          googleId: userProfile.sub,
          name: userProfile.name,
          email: userProfile.email
        });
        await user.save();
        done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;