const express = require("express");
const router = express.Router();

const { outsider } = require("../middleware/auth");
const Story = require("../models/Stories");

const helper = require("../helper/ejs");
/**
 * @description New Story Editor
 * @route GET /story/new
 */

router.get("/new", outsider, async (req, res) => {
  res.render("pages/new-story", {
    layout: "layouts/main",
    displayName: req.user.displayName,
    photo: req.user.image,
  });
});

/**
 * @description Published New Story
 * @route POST /story/new
 */

router.post("/new", outsider, async (req, res) => {
  try {
    req.body.author = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

/**
 * @description All Stories
 * @route GET /story/all
 */

router.get("/all", outsider, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("author")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("pages/all-stories", {
      layout: "layouts/main",
      displayName: req.user.displayName,
      photo: req.user.image,
      loggedUserId: req.user.id,
      stories,
      helper,
    });
  } catch (error) {
    res.render("error/500");
  }
});

/**
 * @description Single story
 * @route GET /story/id
 */

router.get("/:id", outsider, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id })
      .populate("author")
      .lean();
    res.render("pages/single-story", {
      layout: "layouts/main",
      displayName: req.user.displayName,
      photo: req.user.image,
      story,
      helper,
    });
  } catch (error) {
    res.render("error/500");
  }
});

/**
 * @description Edit story
 * @route GET /story/edit/:id
 */

router.get("/edit/:id", outsider, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      status: "private",
    }).lean();

    if (!story) {
      return res.render("error/404", {
        layout: "layouts/login",
      });
    }
    if (story.author != req.user.id) {
      res.redirect("/story/all");
    } else {
      res.render("pages/edit-story", {
        layout: "layouts/main",
        displayName: req.user.displayName,
        photo: req.user.image,
        story,
        helper,
      });
    }
  } catch (error) {
    res.render("error/500");
  }
});

/**
 * @description Edit story
 * @route PUT /story/edit/:id
 */

router.put("/edit/:id", outsider, async (req, res) => {
  try {
    let story = await Story.findOne({
      _id: req.params.id,
      status: "private",
    }).lean();

    if (!story) {
      return res.render("error/404", {
        layout: "layouts/login",
      });
    }
    console.log(story.author, req.user.id);
    //login for checking the authorization
    if (story.author != req.user.id) {
      console.log("object");
      res.redirect("/story/all");
    }

    /**
     * new : Checks if there in no data for given req, it creates one
     * runValidators: validates all fields are correct
     */
    story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.render("error/500", { layout: "layouts/login" });
  }
});

/**
 * @description Delete story
 * @route DELETE /story/delete/id
 */

router.delete("/delete/:id", outsider, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    res.render("error/500");
  }
});

/**
 * @description All stories of a single user
 * @route GET /story/user/id
 */

router.get("/user/:id", outsider, async (req, res) => {
  try {
    const stories = await Story.find({
      author: req.params.id,
      status: "public",
    })
      .populate("author")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("pages/all-stories", {
      layout: "layouts/main",
      displayName: req.user.displayName,
      photo: req.user.image,
      loggedUserId: req.user.id,
      stories,
      helper,
    });
  } catch (error) {
    res.render("error/500");
  }
});
module.exports = router;
