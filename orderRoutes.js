// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { placeOrder, getAllOrders, getUserOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/orderController");

router.post("/",              placeOrder);        // PLACE order
router.get("/",               getAllOrders);       // GET all orders (admin)
router.get("/user/:userId",   getUserOrders);      // GET orders by user
router.get("/:id",            getOrderById);       // GET single order
router.put("/:id",            updateOrderStatus);  // UPDATE status
router.delete("/:id",         deleteOrder);        // CANCEL order

module.exports = router;
