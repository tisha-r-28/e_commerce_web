const Joi = require("joi");

const orderProductSchema = Joi.object({
    productId: Joi.string().required(), // Product ID should be a string (ObjectId)
    quantity: Joi.number().integer().min(1).required(), // Quantity should be at least 1
    originalPrice: Joi.number().min(0).required(), // Original price should be a non-negative number
    discountedPrice: Joi.number().min(0).required() // Discounted price should be a non-negative number
});

const shippingAddressSchema = Joi.object({
    fullName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    pinCode: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().required()
});

const createOrder = {
    body: Joi.object({
        id: Joi.string(),
        products: Joi.array().items(orderProductSchema).min(1).required(), // There should be at least one product
        shippingAddress: shippingAddressSchema.required(), // Shipping address is required
        totalPrice: Joi.number().min(0), // Total price should be a non-negative number
        shippingPrice: Joi.number().min(0).required(), // Shipping price should be a non-negative number
        paymentMethod: Joi.string().valid("Credit Card", "PayPal", "Cash on Delivery").required(),
        paymentStatus: Joi.string().valid("Pending", "Paid", "Failed").default("Pending"),
        paymentDate: Joi.date().optional(),
        paymentIntentId: Joi.string(),
        taxAmount: Joi.number().min(0).default(0), // Tax amount should be a non-negative number
        orderStatus: Joi.string().valid("Pending", "Processing", "Shipped", "Delivered", "Cancelled").default("Pending"),
        isDelivered: Joi.boolean().default(false),
        deliveryDate: Joi.date().optional()
    })
};

const updateOrder = {
    params: Joi.object({
        orderId: Joi.string().pattern(/^[a-fA-F0-9,]+$/).required() 
    })
}

module.exports = {
    createOrder,
    updateOrder
};
