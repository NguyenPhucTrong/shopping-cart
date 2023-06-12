var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { Schema } = mongoose;
var csrf = require("csurf");
var passport = require("passport");
const { Result } = require("express-validator");
var User = require("../models/user");

router.use(csrf());

router.get("/profile", isLoggedIn, function (req, res, next) {
  User.findById(req.user.id)
    .then(function (user) {
      res.render("user/profile", {
        csrfToken: req.csrfToken(),
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        age: user.age,
      });
    })
    .catch(function (err) {
      console.log(err);
      res.redirect("/");
    });
});
router.post("/profile/:id", function (req, res, next) {
  User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        updatedDate: new Date().toLocaleString(),
      },
    }
  )
    .then(function (user) {
      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
    });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/user/signin");
  });
});

router.use("/", notLoggedIn, function (req, res, next) {
  next();
});

router.get("/signup", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true,
  })
);

router.get("/signin", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin",
    failureFlash: true,
  })
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/signin");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
