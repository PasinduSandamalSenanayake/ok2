const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const Product = require("../models/Product");
const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product.
 *                 example: iPhone 14
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *                 example: 999.99
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authenticate, authorize(["admin"]), async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const product = new Product({ name, price, userId: req.user._id });
    await product.save();

    res.status(201).send("Product created successfully.");
  } catch (err) {
    res.status(500).send("Error creating product: " + err.message);
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Product ID.
 *                     example: 64a7e3b52b7c3f42d8e88c6b
 *                   name:
 *                     type: string
 *                     description: Name of the product.
 *                     example: iPhone 14
 *                   price:
 *                     type: number
 *                     description: Price of the product.
 *                     example: 999.99
 *                   userId:
 *                     type: string
 *                     description: ID of the user who created the product.
 *                     example: 64a7e3b52b7c3f42d8e88c6a
 *       500:
 *         description: Internal server error.
 */
router.get("/", async (req, res) => {
  // console.log("User Role:", req.user.role);
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).send("Error retrieving products: " + err.message);
  }
});

module.exports = router;
