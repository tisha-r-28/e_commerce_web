const Joi = require("joi");

const createProduct = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().valid("Men", "Women").required(),
        subCategory: Joi.string().required(),
        availability: Joi.object({
            inStock: Joi.boolean().default(true),
            stockQuantity: Joi.number().required().default(0)
        }).required(),
        salePrice: Joi.number().allow(null).default(null),
        isOnSale: Joi.boolean().default(false),
        colors: Joi.string().optional(),
        images: Joi.array().items(
            Joi.object({
                url: Joi.string().required(),
                altText: Joi.string().required()
            })
        ).required(),
        ratings: Joi.object({
            averageRating: Joi.number().default(0.0),
            totalReviews: Joi.number().default(0)
        }).optional(),
        shippingCost: Joi.number().default(0),
        returnsPolicy: Joi.string().default("05 days return policy.")
    })
};

const removeProduct = {
    params: Joi.object({
        productIds: Joi.string().pattern(/^[a-fA-F0-9,]+$/).required() // Accepts hex strings (MongoDB IDs) separated by commas
    })
}

const updateProducts = {
    params: Joi.object({
        productId: Joi.string().pattern(/^[a-fA-F0-9,]+$/).required() // Accepts hex strings (MongoDB IDs) separated by commas
    })
}

module.exports = {
    createProduct,
    removeProduct,
    updateProducts
};
