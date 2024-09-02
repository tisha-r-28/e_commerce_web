const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true,
            minlength: 10
        },
        role: { 
            type: String, 
            enum: ["customer", "admin", "seller"], 
            default: "customer" 
        },
        address: [{
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String
        }],
        cardDetails: [{
            cardNo: Number,
            cardType: String
        }],
        whishlist: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number,
                min: 1
            },
            totalAmount: Number
        }],
        cart: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number,
                min: 1
            },
            totalAmount: Number
        }],
        reviews: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "products"
            },
            rating: Number,
            comment: String 
        }]
    },
    { timestamps: true }
)

const User = mongoose.model('users', userSchema);
module.exports = User;