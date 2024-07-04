const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  isDisplay: { type: Boolean, default: false },
  userID: { type: String, required: true },
  imagePath: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, require: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date },
});

module.exports = mongoose.model("Product", schema);
