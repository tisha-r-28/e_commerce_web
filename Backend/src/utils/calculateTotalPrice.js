module.exports = (products, existingProducts, shippingPrice = 0, taxAmount = 0) => {

    const productTotal = products.reduce((total, item) => {
        const product = existingProducts.find(p => p._id.toString() === item.productId);
        return total + product.price * item.quantity;
    }, 0);

    return productTotal + shippingPrice + taxAmount;
};