const mongoose = require("mongoose");

const userDB = mongoose.createConnection(
  "mongodb+srv://sandamalsenanayake5:941o9hD2oDwYeoHe@cluster0.yfocc.mongodb.net/userDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const productDB = mongoose.createConnection(
  "mongodb+srv://sandamalsenanayake5:941o9hD2oDwYeoHe@cluster0.yfocc.mongodb.net/productDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = { userDB, productDB };
