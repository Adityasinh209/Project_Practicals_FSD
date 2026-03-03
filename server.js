// server.js - Main Entry Point
// College Project: MongoDB Integration with Mongoose

require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const connectDB = require("./config/db");

const app = express();

// ── Middleware ───────────────────────────────
app.use(express.json()); // Parse incoming JSON requests

// ── Connect to MongoDB ───────────────────────
connectDB();

// ── Routes ───────────────────────────────────
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users",    require("./routes/userRoutes"));
app.use("/api/cart",     require("./routes/cartRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));

// ── Home Route ───────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🛒 E-Commerce API is running!",
    routes: {
      users:    "http://localhost:3000/api/users",
      products: "http://localhost:3000/api/products",
      cart:     "http://localhost:3000/api/cart",
      orders:   "http://localhost:3000/api/orders",
    },
  });
});

// ── 404 Handler ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Start Server ─────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
