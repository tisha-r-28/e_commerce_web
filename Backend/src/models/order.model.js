const mongoose = require("mongoose");
const { Schema } = mongoose;

const shippingAddressSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    pinCode: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    }
}, { _id: false });

const orderSchema = new Schema({
    id:{
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        ref: "users"
    },
    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'products', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1 
        },
        originalPrice: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        discountedPrice: { 
            type: Number, 
            required: true, 
            min: 0 
        }
    }],
    shippingAddress: shippingAddressSchema,
    totalPrice: {
        type: Number
    },
    shippingPrice: {
        type: Number,
        required: true
    },
    paymentMethod: { 
        type: String, 
        enum: ["Credit Card", "PayPal", "Cash on Delivery"], 
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending' 
    },
    paymentDate: { 
        type: Date 
    },
    paymentIntentId: { 
        type: String 
    },
    taxAmount: { 
        type: Number, 
        default: 0 
    },
    orderStatus: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    isDelivered: { 
        type: Boolean, 
        default: false 
    }, 
    deliveryDate: { 
        type: Date 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true })

const Orders = mongoose.model("orders", orderSchema);
module.exports = Orders;