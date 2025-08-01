const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const {cartPrice} = require('../utils/cartPrice');
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const Invoice = require('../models/invoiceModel');

const getCart = asyncHandler(async (userId,session = null)=>{
    return await Cart.findOne({user: userId}).session(session);;
});


const getCartDetails = asyncHandler(async (userId,next,session=null)=>{
    const cart = await getCart(userId,session);
    if (!cart) {
        return next(new ApiError('cart not founded',404));
    }
    if(cart.coupon){
        return cart;
    }
    const prices =  await cartPrice(cart);
    cart.toObject();
    cart.coupon = null;
    cart.total_price = prices.total_price;
    cart.total_price_after_discount = prices.total_price_after_discount;
    return cart;
});



const createOrder = asyncHandler(async (cart,pay_type, session = null)=>{
    const orderDetails = await Promise.all(
        cart.cartItems.map(async item => {
            const product = await Product.findById(item.product).session(session);;
            product.quantity -= item.quantity;
            product.sold += item.quantity;
            await product.save();

            return {
                product: item.product,
                price: product.price_after_discount ?? product.price,
                quantity: item.quantity
            };
        })
    );

  const order = await  Order.create({
        user:cart.user,
        coupon:cart.coupon,
        payment_type:pay_type,
        total_price:cart.total_price,
        total_price_after_discount:cart.total_price_after_discount,
        order_details:orderDetails
    });

    await createInvoice(order);
});

const createInvoice = asyncHandler(async (order, session = null) => {
    await Invoice.create([{ order: order._id }], { session });
});



module.exports={getCart,getCartDetails,createOrder};


