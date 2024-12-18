const mongoose = require("mongoose");
const { userDB } = require("../database/db");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "manager"], required: true },
});

module.exports = userDB.model("User", userSchema);
