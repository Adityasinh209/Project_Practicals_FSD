// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { addToCart, getCart, updateCartItem, clearCart } = require("../controllers/cartController");

router.post("/",           addToCart);       // ADD item to cart
router.get("/:userId",     getCart);         // GET user's cart
router.put("/",            updateCartItem);  // UPDATE item quantity
router.delete("/:userId",  clearCart);       // CLEAR entire cart

module.exports = router;
