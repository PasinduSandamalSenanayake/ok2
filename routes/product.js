const express = require("express");
const Product = require("../models/Product");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Create Product (Admin only)
router.post(
  "/",
  // authenticate, authorize(["admin"]),
  async (req, res) => {
    const { name, price, userId } = req.body;

    try {
      const product = new Product({ name, price, userId });
      await product.save();
      res.status(201).send("Product Created");
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

// Get All Products
const axios = require("axios");

// Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    // Fetch user details for each product
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        try {
          // Fetch user details from the auth API
          const response = await axios.get(
            `https://ok2-183873252446.asia-south1.run.app/auth/${product.userId}`
          );
          const username = response.data.username;
          const userRole = response.data.role;

          // Add the username to the product object
          return {
            ...product.toObject(),
            username,
            userRole,
          };
        } catch (error) {
          console.error(
            `Error fetching user details for userId: ${product.userId}`,
            error.message
          );
          return {
            ...product.toObject(),
            username: "Unknown", // Fallback if the API call fails
          };
        }
      })
    );

    res.status(200).json({
      message: "Success",
      data: enrichedProducts,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Product (Admin only)
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send("Product Deleted");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update Product (Manager only)
router.put("/:id", authenticate, authorize(["manager"]), async (req, res) => {
  try {
    const { name, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price },
      { new: true }
    );
    res.send(updatedProduct);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
