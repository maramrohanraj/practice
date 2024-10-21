const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set view engine to EJS
app.set("view engine", "ejs");

// Connect to MongoDB Atlas
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB Connection Error: ", err));

// Product Schema and Model
const productSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  img: String,
  price: Number,
  id: Number,
});
const Product = mongoose.model("Product", productSchema);

// Dynamic route for fetching products based on ID range
app.get("/getProducts/:from/:to", async (req, res) => {
  const from = parseInt(req.params.from);
  const to = parseInt(req.params.to);

  try {
    const products = await Product.find({ id: { $gte: from, $lte: to } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products" });
  }
});

// Render the HTML home page
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
