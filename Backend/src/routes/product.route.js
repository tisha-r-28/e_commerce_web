const express = require("express");
const validate = require("../middlewares/joi.validate");
const { createProduct, removeProduct, updateProducts, getProductsById, sortProducts } = require("../validations/product.joi.schema");
const authentication = require("../middlewares/authentication");
const productControllers = require("../controllers/product.controllers");

const router = express.Router();

router.post("/create-product", authentication, validate(createProduct), productControllers.createProduct);
router.delete("/remove-products/:productIds", authentication, validate(removeProduct), productControllers.deleteProducts);
router.put("/update-products/:productId", authentication, validate(updateProducts), productControllers.updateProducts);
router.get("/get-products", productControllers.getAllProducts);
router.get("/get-product/:productId", validate(getProductsById), productControllers.getProductsById);
router.get("/sort-product", validate(sortProducts), productControllers.sortProducts);

module.exports = router;