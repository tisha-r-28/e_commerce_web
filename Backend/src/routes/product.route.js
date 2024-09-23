const express = require("express");
const validate = require("../middlewares/joi.validate");
const { createProduct } = require("../validations/product.joi.schema");
const authentication = require("../middlewares/authentication");
const productControllers = require("../controllers/product.controllers");

const router = express.Router();

router.post("/create-product", authentication, validate(createProduct), productControllers.createProduct);

module.exports = router;