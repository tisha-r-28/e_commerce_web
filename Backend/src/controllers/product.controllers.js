const mongoose = require("mongoose");
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
    },
    //2 delete product route
    deleteProducts: async (req, res) => {
        try {
            
            const userId = req.user.id;
            const { productIds } = req.params;

            const multiProductIds = productIds.split(",").map(id => id.trim());
            
            const user = await User.findById(userId);
            if (!user || user.role !== "admin") {
                return apiResponse.UNAUTHORIZED({
                    res,
                    message: `Cannot create product: ${message.unauthorized}`
                });
            }

            var notFoundProductIds = [];

            const deleteProducts = await Promise.all(multiProductIds.map(async (id) => {
                const objectIds = new mongoose.Types.ObjectId(id);
                const isProduct = await Product.findById(objectIds);
                if(!isProduct){
                    notFoundProductIds.push(id);
                    return null;
                }
                return await Product.findByIdAndDelete(objectIds);
            }));

            if(notFoundProductIds.length > 0){
                return apiResponse.NOT_FOUND({
                    res,
                    message: `Products not found: ${message.not_found} : ${notFoundProductIds.join(", ")}`
                })
            }
            //!deleteProducts.filter(Boolean).length will return only truuthy value's length
            if (!deleteProducts.filter(Boolean).length || !deleteProducts) {
                return apiResponse.CONFLICT({
                    res,
                    message: `No products were deleted: ${message.conflict}`
                });
            }

            return apiResponse.OK({
                res, 
                message: message.deleted
            });

        } catch (error) {
            logger.error(`${message.something_went_wrong} | ${error.message}`);
            return apiResponse.CATCH_ERROR({
                res,
                message: `${message.something_went_wrong} | ${error.message}`
            });
        }
    },
    //3: update products
    updateProducts: async (req, res) => {
        try {

            const userId = req.user.id;
            const { productId } = req.params;

            const user = await User.findById(userId);
            if (!user || user.role !== "admin") {
                return apiResponse.UNAUTHORIZED({
                    res,
                    message: `Cannot create product: ${message.unauthorized}`
                });
            }

            const isProduct = await Product.findById(productId);
            if(!isProduct){
                return apiResponse.NOT_FOUND({
                    res,
                    message: `Products ${message.not_found}`
                });
            }

            const updatedProducts = await Product.findByIdAndUpdate(productId, { $set: req.body }, { new: true });

            if(!updatedProducts){
                return apiResponse.CONFLICT({
                    res,
                    message: `No products were updated: ${message.conflict}`
                });
            }

            return apiResponse.OK({
                res,
                message: message.updated,
                data: updatedProducts
            }) 

        } catch (error) {
            logger.error(error.message);
            return apiResponse.CATCH_ERROR({
                res,
                message: `${message.something_went_wrong} | ${error.message}`
            });
        }
    }
};
