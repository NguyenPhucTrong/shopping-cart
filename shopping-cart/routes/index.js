var express = require("express");
const product = require("../models/product");
var router = express.Router();
var Cart = require("../models/cart");
var Product = require("../models/product");
const user = require("../models/user");

/* GET home page. */
router.get("/", function (req, res, next) {
  let page = parseInt(req.query.page) || 1;
  let perPage = 6;
  let start = (page - 1) * perPage;
  let end = page * perPage;

  Product.find()
    .skip(start)
    .limit(perPage)
    .sort({ _id: -1 })
    .then((products) => {
      products.forEach((product) => {
        if (req.user && product.userID == req.user.id) {
          product.isDisplay = true;
        } else {
          product.isDisplay = false;
        }
      });
      res.render("shop/index", {
        title: "Shopping cart",
        products,
      });
    })
    .catch((err) => {
      if (err) res.send(err);
    });
});

router.get("/add-to-cart/:id", isLoggedIn, function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        throw new Error("Product not found");
      }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

router.get("/reduce/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  console.log(cart);
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/remove/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  console.log(cart);
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/shopping-cart", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  console.log(Cart);
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice.toFixed(2),
  });
});

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
