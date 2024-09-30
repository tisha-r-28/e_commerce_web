const express = require("express");
const validate = require("../middlewares/joi.validate");
const { createOrder } = require("../validations/order.joi.schema");
const orderControllers = require("../controllers/order.controllers");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/place-order", authentication, validate(createOrder), orderControllers.placeOrder);

module.exports = router;