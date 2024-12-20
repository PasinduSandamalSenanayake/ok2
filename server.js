const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// Connect to MongoDB and Start Server
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     app.listen(process.env.PORT1, () =>
//       console.log(`Server running on port ${process.env.PORT1}`)
//     );
//   })
//   .catch((err) => console.log(err));

const PORT = process.env.PORT1;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
