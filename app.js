var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser"); //dòng 4
var bodyParser = require("body-parser"); //dòng 5
var expressHbs = require("express-handlebars");
var mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
const { param } = require("express-validator");
var MongoStore = require("connect-mongo");
var indexRouter = require("./routes/index");
var productRouter = require("./routes/product");
var userRouter = require("./routes/user");

var app = express();

mongoose
  .connect("mongodb://0.0.0.0:27017/shoppping")
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));
require("./config/passport");
const { Passport } = require("passport");

// view engine setup
app.engine(
  ".hbs",
  expressHbs.engine({
    defaultLayout: "layout",
    extname: ".hbs",
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      },
    },
  })
);
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "mysuperserect",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb://0.0.0.0:27017/shoppping",
      ttl: 60 * 60 * 1000, // 1 day
    }),
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.messages = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
