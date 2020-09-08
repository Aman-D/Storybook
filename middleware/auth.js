module.exports = {
  outsider: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  appUser: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
