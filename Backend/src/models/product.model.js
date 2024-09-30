const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true,  // Discount in percentage (e.g., 10 for 10%)
        default: 0
    },
    discountedPrice: {
        type: Number,  // This will be automatically calculated and saved
        required: true
    },
    category: {
        type: String,
        enum: ["Men", "Women"],
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    availability: {  
        inStock: {  
            type: Boolean,  
            default: true  
        },  
        stockQuantity: {  
            type: Number,  
            required: true,  
            default: 0  
        }  
    },
    salePrice: {  
        type: Number,  
        default: null  
    },  
    isOnSale: {  
        type: Boolean,  
        default: false  
    },
    colors: {
        type: String,
    },
    images: [{  
        url: {  
            type: String,  
            required: true  
        },  
        altText: {  
            type: String,  
            required: true  
        }  
    }],
    ratings: {  
        averageRating: {  
            type: Number,  
            default: 0.0  
        },  
        totalReviews: {  
            type: Number,  
            default: 0  
        }  
    }, 
    shippingCost: {  
        type: Number,  
        default: 0  
    },  
    returnsPolicy: {  
        type: String,  
        default: "05 days return policy."  
    }  
}, { timestamps: true });

productSchema.pre('save', function(next) {
    if (this.discount > 0) {
        this.discountedPrice = this.price - (this.price * (this.discount / 100));
    } else {
        this.discountedPrice = this.price;
    }
    next();
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
