const express = require("express");
const router = express.Router();

const { appUser, outsider } = require("../middleware/auth");
const Story = require("../models/Stories");

const helper = require("../helper/ejs");
/**
 * @description Landing page for Login
 * @route GET /
 */

router.get("/", appUser, (req, res) => {
  res.render("pages/login", { layout: "layouts/login" });
});

/**
 * @description Dashboard only if logged in
 * @route GET /dashboard
 */

router.get("/dashboard", outsider, async (req, res) => {
  try {
    const stories = await Story.find({ author: req.user.id })
      .sort({ createdAt: "desc" })
      .lean();
    res.render("pages/dashboard", {
      layout: "layouts/main",
      displayName: req.user.displayName,
      photo: req.user.image,
      stories,
      helper,
    });
  } catch (error) {
    res.render("error/500");
  }
});

module.exports = router;
