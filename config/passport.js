var GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (request, accessToken, refreshToken, profile, done) => {
        /**
         * 1. Create a new User using the profile id.
         * 2. If already have the same user in database then call the callback using done.
         * 3. Else create a new user in the database and call the callback using done.
         */
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  /**
   * In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
   *
   * Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
   */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
