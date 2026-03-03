// controllers/orderController.js
// CRUD Operations for Orders

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// CREATE - Place a new order
// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, paymentMethod } = req.body;

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Prepare order items from cart
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
    }));

    // Create new order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    // Reduce stock for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }, // Decrement stock
      });
    }

    // Clear the cart after order is placed
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ - Get all orders (admin view)
// GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")          // Join User data
      .populate("items.product", "name price") // Join Product data
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ - Get orders for a specific user
// GET /api/orders/user/:userId
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ - Get single order by ID
// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name price imageUrl");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE - Update order status (admin)
// PUT /api/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (status === "Delivered") updateData.deliveredAt = new Date(); // Set delivery date

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE - Cancel/Delete an order
// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only allow cancellation if order is still Pending
    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { placeOrder, getAllOrders, getUserOrders, getOrderById, updateOrderStatus, deleteOrder };
