const logger = require("../config/logger");
const message = require("../json/messages.json");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const apiResponse = require("../utils/api.response");

module.exports = {
    createProduct: async (req, res) => {
        try {
            const userId = req.user.id;
            const { title, description, price, category, subCategory, availability, salePrice, isOnSale, colors, images, ratings, shippingCost, returnsPolicy } = req.body;

            const user = await User.findById(userId);
            if (!user || user.role !== "admin") {
                return apiResponse.UNAUTHORIZED({
                    res,
                    message: `Cannot create product: ${message.unauthorized}`
                });
            }

            const product = await Product.create({
                title, 
                description,
                price,
                category,
                subCategory,
                availability, 
                salePrice,
                isOnSale,
                colors,
                images,
                ratings,
                shippingCost,
                returnsPolicy
            });

            if (!product) {
                return apiResponse.CONFLICT({
                    res,
                    message: message.conflict
                });
            }

            return apiResponse.OK({
                res,
                message: message.created,
                data: {
                    product
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
};
