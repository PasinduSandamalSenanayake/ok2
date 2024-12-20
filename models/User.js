const mongoose = require("mongoose");
const { userDB } = require("../database/db");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  seatCount: { type: Number, required: true },
  seatArray: { type: Array },
  price1: { type: Number, required: true },
  price2: { type: Number, required: true },
  price3: { type: Number, required: true },
});

module.exports = userDB.model("User", userSchema);
