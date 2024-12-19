const mongoose = require("mongoose");
const { productDB, userDB } = require("../database/db");

const productSchema = new mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  seat: { type: Array, required: true },
  userId: { type: String, required: true },
});

module.exports = productDB.model("Product", productSchema);
