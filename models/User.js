const mongoose = require("mongoose");
const { userDB } = require("../database/db");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  seatArray: { type: Array, required: true },
  price: { type: Number, required: true },
});

module.exports = userDB.model("User", userSchema);
