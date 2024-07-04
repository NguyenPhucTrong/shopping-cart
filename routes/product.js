var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { Schema } = mongoose;
var csrf = require("csurf");
var passport = require("passport");
const { Result } = require("express-validator");
var Product = require("../models/product");

router.use(csrf());

/* add product  */

router.get("/add-product", isLoggedIn, function (req, res, next) {
  res.render("product/add-product", { csrfToken: req.csrfToken() });
});

router.post("/add-product", function (req, res, next) {
  var products = new Product({
    userID: req.user.id,
    imagePath: req.body.imageURl,
    title: req.body.title,
    quantity: req.body.quantity,
    description: req.body.description,
    price: req.body.price,
  });
  products
    .save()
    .then(function (result) {
      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
});

/* edit product. */

router.get("/edit-product/:id", isLoggedIn, function (req, res, next) {
  Product.findById(req.params.id)
    .then(function (product) {
      res.render("product/edit-product", {
        csrfToken: req.csrfToken(),
        _id: product._id,
        imagePath: product.imagePath,
        description: product.description,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
      });
    })
    .catch(function (err) {
      console.log(err);
      res.redirect("/");
    });
});

router.post("/edit-product/:id", function (req, res, next) {
  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        user: req.user.id,
        imagePath: req.body.imagePath,
        title: req.body.title,
        quantity: req.body.quantity,
        description: req.body.description,
        price: req.body.price,
        updatedDate: new Date().toLocaleString(),
      },
    }
  )
    .then(function (product) {
      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
    });
});

/* delete prod. */

router.get("/delete-product/:id", isLoggedIn, function (req, res, next) {
  res.json({ csrfToken: req.csrfToken() });
});

router.delete("/delete-product/:id", function (req, res, next) {
  Product.findByIdAndRemove(req.params.id)
    .then(function () {
      res.json({ messsage: "Delete Succesfully" });
    })
    .catch(function (err) {
      console.log(err);
      res.json({ messsage: "Failure" });
    });
});

router.use("/", notLoggedIn, function (req, res, next) {
  next();
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
