const express = require("express");
const validate = require("../middlewares/joi.validate");
const { createOrder, updateOrder } = require("../validations/order.joi.schema");
const orderControllers = require("../controllers/order.controllers");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/place-order", authentication, validate(createOrder), orderControllers.placeOrder);
router.post("/place-order-stripe", authentication, validate(createOrder), orderControllers.placeOrderStripe);
router.put("/update-order/:orderId", authentication, validate(updateOrder), orderControllers.updateOrder);

module.exports = router;