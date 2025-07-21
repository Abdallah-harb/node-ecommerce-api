const {ProductResource} = require('../products/productResource');
const CartResource = async (cart) => {
    if(!cart){
        return null;
    }
    let total_price = 0;
    let total_price_after_discount = 0;

    const cartItems = await Promise.all(
        (cart.cartItems || []).map(async (item) => {
            const product = await ProductResource(item.product);
            const quantity = item.quantity;

            const item_price = product.price * quantity;
            const item_price_discount = (product.price_after_discount ?? product.price) * quantity;
            total_price += item_price;
            total_price_after_discount += item_price_discount;

            return {
                quantity,
                product
            };
        })
    );

    return {
        id: cart._id,
        cartItems:cartItems,
        total_price:total_price,
        price_after_discount: total_price_after_discount,
        user: cart.user,
    };
};

module.exports={CartResource}