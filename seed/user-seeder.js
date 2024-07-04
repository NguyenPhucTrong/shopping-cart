var User = require("../models/user");
var mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0:27017/shoppping")
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

// var users = [
//   new User({
//     email: "text@text.com",
//     password: "1234",
//   }),
//   new Product({
//     imagePath: "https://pbs.twimg.com/media/FZ9VfZAVEAEVPs9.jpg:large",
//     title: "RF Moscow",
//     description: "Model",
//     price: 10,
//   }),
// ];

Promise.all(users.map((user) => user.save()))
  .then((results) => {
    console.log(`${results.length} user saved`);
    exit();
  })
  .catch((error) => {
    console.error(`Error saving products: ${error}`);
    exit();
  });

function exit() {
  mongoose.disconnect();
}
