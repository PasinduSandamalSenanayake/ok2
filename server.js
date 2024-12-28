const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
require("dotenv").config();

const swaggerDocs = require("./swaggerConfig");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

const app = express();

// Enable CORS Middleware (cleaned up)
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // If you're sending cookies or authentication headers
  })
);

// Middleware to handle OPTIONS requests (preflight)
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.status(204).send(); // No content for OPTIONS
// });

// Middleware to parse JSON
app.use(bodyParser.json());

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// Database connection (optional, add your DB connection logic if required)

// Start the server
const PORT = process.env.PORT1 || 5000; // Add default value
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
