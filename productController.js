// controllers/productController.js
// CRUD Operations for Products

const Product = require("../models/Product");

// ─────────────────────────────────────────────
// CREATE - Add a new product
// POST /api/products
// ─────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body); // Create instance from request body
    const saved = await product.save();    // Save to MongoDB

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: saved,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// READ - Get all products
// GET /api/products
// ─────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    // Support optional query filters: ?category=Electronics&minPrice=100
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice)  filter.price = { $gte: Number(req.query.minPrice) };

    const products = await Product.find(filter).sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// READ - Get single product by ID
// GET /api/products/:id
// ─────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE - Update a product
// PUT /api/products/:id
// ─────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Return updated document
        runValidators: true, // Re-run schema validators
      }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE - Delete a product
// DELETE /api/products/:id
// ─────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
