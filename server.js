const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const swaggerDocs = require("./swaggerConfig");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

const app = express();
app.use(bodyParser.json());

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT1;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
