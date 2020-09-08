// Node Modules import
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
var methodOverride = require("method-override");
const MongoStore = require("connect-mongo")(session);
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");

// Application Imports
const connectDB = require("./config/db");

//Config file
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Morgan for Logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// set the view engine to ejs ans use expresslayouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");

//Express session
app.use(
  session({
    secret: "Aman",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middelware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/story", require("./routes/story"));

// PORT
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running on PORT ${PORT} in ${process.env.NODE_ENV} mode`
  )
);
