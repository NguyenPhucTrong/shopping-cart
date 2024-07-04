var Product = require("../models/product");
var mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0:27017/shoppping")
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

var products = [
  new Product({
    imagePath: "https://pbs.twimg.com/media/FZ9VfZAVEAEVPs9.jpg:large",
    title: "RF Moscow",
    description: "Model",
    price: 10,
  }),
  new Product({
    imagePath: "https://pbs.twimg.com/media/FZ9VfZAVEAEVPs9.jpg:large",
    title: "RF Moscow",
    description: "Model",
    price: 10,
  }),
];

Promise.all(products.map((product) => product.save()))
  .then((results) => {
    console.log(`${results.length} products saved`);
    exit();
  })
  .catch((error) => {
    console.error(`Error saving products: ${error}`);
    exit();
  });

function exit() {
  mongoose.disconnect();
}
