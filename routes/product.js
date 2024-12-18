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
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    // .populate({
    //   path: "userId",
    //   select: "username",
    // });
    res.status(200).json({
      message: "Success",
      data: products,
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
