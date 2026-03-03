// controllers/cartController.js
// CRUD Operations for Cart

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// CREATE / ADD item to cart
// POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Cart exists - check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity if product already exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({ product: productId, quantity, price: product.price });
      }
    } else {
      // Create new cart for user
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price: product.price }],
      });
    }

    await cart.save(); // pre-save hook calculates totalAmount

    // Populate product details for response
    await cart.populate("items.product", "name price imageUrl");

    res.status(200).json({ success: true, message: "Item added to cart", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ - Get cart by user ID
// GET /api/cart/:userId
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate("items.product", "name price imageUrl isAvailable"); // JOIN with Product

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart is empty" });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE - Update item quantity in cart
// PUT /api/cart
const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Cart updated", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE - Remove item from cart / clear cart
// DELETE /api/cart/:userId
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addToCart, getCart, updateCartItem, clearCart };
