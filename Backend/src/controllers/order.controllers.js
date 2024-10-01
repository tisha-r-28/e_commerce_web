const logger = require("../config/logger");
const Orders = require("../models/order.model");
const message = require("../json/messages.json");
const apiResponse = require("../utils/api.response");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const calculateTotalPrice = require("../utils/calculateTotalPrice");

const uuid = require("uuid").v4;
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
    //1 : create order with paymemt method COD.
    placeOrder: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {
                return apiResponse.UNAUTHORIZED({
                    res,
                    message: `Login or Signup to place an order: ${message.unauthorized}`
                });
            }
            const { products, shippingAddress, totalPrice, shippingPrice, paymentMethod, paymentStatus, paymentDate, taxAmount, orderStatus, deliveryDate } = req.body;

            const productIds = products.map(product => product.productId);
            const existingProducts = await Product.find({ _id: { $in: productIds } });
            
            if (existingProducts.length !== products.length) {
                return apiResponse.BAD_REQUEST({
                    res,
                    message: "One or more products are not available."
                });
            }

            const newOrder = await Orders.create({
                id: uuid(),
                userId : user._id,
                products, 
                shippingAddress, 
                totalPrice, 
                shippingPrice, 
                paymentMethod, 
                paymentStatus, 
                paymentDate, 
                taxAmount, 
                orderStatus, 
                isDelivered: false,
                deliveryDate
            });
            if(!newOrder){
                return apiResponse.CONFLICT({
                    res,
                    message: message.conflict
                })
            }
            return apiResponse.OK({
                res,
                message: message.created,
                data: {
                    newOrder
                }
            })
        } catch (error) {
            logger.error(`${message.something_went_wrong} | ${error.message}`);
            return apiResponse.CATCH_ERROR({
                res,
                message: `${message.something_went_wrong} | ${error.message}`
            });
        }
    },
    //2: create an order payments with stripe
    placeOrderStripe: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {
                return apiResponse.UNAUTHORIZED({
                    res,
                    message: `Login or Signup to place an order: ${message.unauthorized}`
                });
            }
            const { products, shippingAddress, shippingPrice, paymentDate, paymentMethod, taxAmount, deliveryDate } = req.body;

            const productIds = products.map(product => product.productId);
            const existingProducts = await Product.find({ _id: { $in: productIds } });
            
            if (existingProducts.length !== products.length) {
                return apiResponse.BAD_REQUEST({
                    res,
                    message: "One or more products are not available."
                });
            }

            const totalPrice = calculateTotalPrice(products, existingProducts, shippingPrice, taxAmount);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalPrice * 100), 
                currency: 'inr',
                payment_method_types: ['card'],
                receipt_email: user.email
            });    

            const newOrder = await Orders.create({
                id: uuid(), 
                userId: user._id,
                products,
                shippingAddress,
                totalPrice,
                shippingPrice,
                paymentMethod,
                paymentStatus: 'Pending',  
                orderStatus: 'Pending',
                paymentDate,
                paymentIntentId: paymentIntent.id,  
                taxAmount,
                totalPrice,
                deliveryDate
            });
    
            if (!newOrder) {
                return apiResponse.BAD_REQUEST({
                    res,
                    message: "Order could not be created"
                });
            } 

            return apiResponse.OK({
                res,
                message: "Payment initiated successfully",
                data: {
                    clientSecret: paymentIntent.client_secret,
                    orderId: newOrder._id,  
                    totalPrice,
                    paymentIntent
                }
            });

        } catch (error) {
            logger.error(`${message.something_went_wrong} | ${error.message}`);
            return apiResponse.CATCH_ERROR({
                res,
                message: `${message.something_went_wrong} | ${error.message}`
            });
        }
    }
}
