// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProduct, getAllProducts, getProductById, updateProduct, deleteProduct
} = require("../controllers/productController");

router.post("/",        createProduct);    // CREATE
router.get("/",         getAllProducts);   // READ ALL
router.get("/:id",      getProductById);  // READ ONE
router.put("/:id",      updateProduct);   // UPDATE
router.delete("/:id",   deleteProduct);   // DELETE

module.exports = router;
