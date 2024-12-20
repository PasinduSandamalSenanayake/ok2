const mongoose = require("mongoose");
const { productDB, userDB } = require("../database/db");

const productSchema = new mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId,
  seatCount: { type: Number, required: true },
  bookedSeatNumber: { type: Array, required: true },
  price: { type: Number, required: true },
  userId: { type: String, required: true },
});

module.exports = productDB.model("Product", productSchema);
