const Product = require('../models/productModel');

exports.cartPrice = async (cart, discount = 0) => {
    let total_price = 0;
    let total_price_after_discount = 0;

    for (const item of cart.cartItems || []) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        const quantity = item.quantity || 1;
        const item_price = product.price * quantity;
        const item_price_discount = (product.price_after_discount ?? product.price) * quantity;

        total_price += item_price;
        total_price_after_discount += item_price_discount;
    }

    let discounted_total = total_price_after_discount;

    if (typeof discount === 'number' && discount > 0) {
        discounted_total -= (total_price_after_discount * discount) / 100;
    }

    return {
        total_price: Number(total_price.toFixed(2)),
        total_price_after_discount: Number(discounted_total.toFixed(2))
    };
};
