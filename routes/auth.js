const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  const { username, seatArray, price } = req.body;

  try {
    const newUser = new User({ username, seatArray, price });
    await newUser.save();
    res.status(201).send("User Registered");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get All Users (Admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get User by ID (Admin only)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("Invalid Username or Password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid Username or Password");

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  res.header("Authorization", token).send("Logged In");
});

module.exports = router;
