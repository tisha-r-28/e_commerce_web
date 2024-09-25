const mongoose = require("mongoose");
const logger = require("../config/logger");
const message = require("../json/messages.json");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const apiResponse = require("../utils/api.response");
const getLowercaseFields = require("../utils/lowerCaseFields");

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
    },
    //4: get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find();

            if(!products){
                return apiResponse.NOT_FOUND({
                    res,
                    message: `Products are ${message.not_found}`
                })
            }

            return apiResponse.OK({
                res,
                message: `All ${message.data_get}`,
                data: products
            })

        } catch (error) {
            logger.error(error.message);
            return apiResponse.CATCH_ERROR({
                res,
                message: `${message.something_went_wrong} | ${error.message}`
            });
        }
    },

    //5: get products by id
    getProductsById: async (req, res) => {
        try {

            const { productId } = req.params;
            const isProduct = await Product.findById(productId);
            if(!isProduct){
                return apiResponse.NOT_FOUND({
                    res, 
                    message: `Product ${message.not_found} for provided id.`
                })
            }
            return apiResponse.OK({
                res,
                message: message.data_get,
                data: isProduct
            })

        } catch (error) {
            logger.error(error.message);
            return apiResponse.CATCH_ERROR({
                res,
                message: `${message.something_went_wrong} | ${error.message}`
            });
        }
    },

    //6: sort products by query params
    sortProducts: async (req, res) => {
        try {
            const sortby = req.query.sortby || "price";
            const order = req.query.order === "desc" ? -1 : 1;
    
            if (!sortby) {
                return apiResponse.BAD_REQUEST({
                    res,
                    message: "Sort field is required."
                });
            }

            const fieldMapping = {
                "averagerating": "ratings.averageRating",
                "totalreviews": "ratings.totalReviews"
            };
    
            const multipleSortBy = sortby.toLowerCase().split(",").map((field) => field.trim());
    
            const validFields = getLowercaseFields(Product);
    
            const mappedSortBy = multipleSortBy.map(field => fieldMapping[field] || field);
    
            const invalidFields = mappedSortBy.filter(field => !validFields.includes(field.toLowerCase()));
            if (invalidFields.length > 0) {
                return apiResponse.BAD_REQUEST({
                    res,
                    message: `Invalid field(s): ${invalidFields.join(", ")}.`
                });
            }
    
            const sortObject = {};
            mappedSortBy.forEach(field => {
                sortObject[field] = order;
            });
    
            const sortedProducts = await Product.find({}).sort(sortObject);
    
            return apiResponse.OK({
                res,
                message: message.data_get,
                data: sortedProducts
            });
        } catch (error) {
            logger.error(error.message);
            return apiResponse.CATCH_ERROR({
                res,
                message: `${message.something_went_wrong} | ${error.message}`
            });
        }
    }
};
