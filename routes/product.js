const express = require("express");
const Product = require("../models/Product");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Create Product (Admin only)
const axios = require("axios");

router.post("/", async (req, res) => {
  const { seatCount, bookedSeatNumber, price, userId } = req.body;

  const response = await axios.get(
    `https://ok2-183873252446.asia-south1.run.app/auth/${userId}`
  );
  const price1 = response.data.price1;
  const price2 = response.data.price2;
  const price3 = response.data.price3;
  console.log(price1, price2, price3);

  try {
    // Create the product
    const product = new Product({
      seatCount,
      bookedSeatNumber,
      price,
      userId,
    });
    await product.save();

    // Update the seat status in auth.js
    await axios.put(
      `https://ok2-183873252446.asia-south1.run.app/auth/${userId}/bookedSeats`,
      {
        bookedSeatNumber,
      }
    );

    res.status(201).send({
      message: "Product Created and Seats Updated",
      seatUpdateResponse: seatUpdateResponse.data,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get All Products
// const axios = require("axios");

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

          // Add the username to the product object
          return {
            ...product.toObject(),
            username,
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
