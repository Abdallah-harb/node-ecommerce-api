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

    const totalPrice = cart.coupon?cart.total_price: Number(total_price.toFixed(2));
    const totalAfterDiscount = cart.coupon?cart.total_price_after_discount:Number(total_price_after_discount.toFixed(2));
    return {
        id: cart._id,
        cartItems:cartItems,
        total_price:totalPrice,
        price_after_discount: totalAfterDiscount,
        user: cart.user,
    };
};

module.exports={CartResource}