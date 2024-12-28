const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user.
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: Password for the user.
 *                 example: myStrongPassword123
 *               role:
 *                 type: string
 *                 description: Role of the user (e.g., admin, user).
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: All fields are required or invalid input.
 *       500:
 *         description: Internal server error.
 */
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    res.status(201).send("User registered successfully.");
  } catch (err) {
    res.status(500).send("Error registering user: " + err.message);
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: myStrongPassword123
 *     responses:
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid credentials or missing fields.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send("User not found.");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid credentials.");

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.header("Authorization", `Bearer ${token}`).send({
      token,
      message: "Login successful!",
    });
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});

module.exports = router;
