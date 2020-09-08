const express = require("express");
const router = express.Router();
const passport = require("passport");

/**
 * @description Authenticate with Google
 * @route GET /auth/google
 */

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

/**
 * @description Google Auth Callback, if succeeds then it goes forwards to dashboard and if it fails
 * then it is redirected to login page.
 * @route GET /auth/google/callback
 */

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

/**
 * @description Logout using the logout method in the request body added by passport
 * @route GET /auth/logout
 */

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
