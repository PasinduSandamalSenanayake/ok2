const mongoose = require("mongoose");
const { productDB, userDB } = require("../database/db");
const e = require("express");

const productSchema = new mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number },
  userId: { type: String, required: true },
});

module.exports = productDB.model("Product", productSchema);
