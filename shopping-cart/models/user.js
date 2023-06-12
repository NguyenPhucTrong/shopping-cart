const mongoose = require("mongoose");
const { Schema } = mongoose;
var bcrypt = require("bcrypt-nodejs");

var userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
  age: { type: Number },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date },
});

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
