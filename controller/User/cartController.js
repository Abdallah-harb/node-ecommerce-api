const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');
const ApiError = require("../../utils/apiError");
const asyncHandler = require('express-async-handler');
const {CartResource} = require('../../resource/cart/cartDetailsResource');
const Coupon = require('../../models/couponModel');
const {cartPrice} = require('../../utils/cartPrice');

const index = asyncHandler(async (req,res)=>{
    const cart = await Cart.findOne({'user':req.user._id}).populate('cartItems.product');
    return jsonResponse(res,{"cart":await CartResource(cart)});

});

const addToCart = asyncHandler(async (req,res,next)=>{
   const product_id = req.body.product_id;
   const product = await Product.findById(product_id);
   if(!product){
       return  next(new ApiError('product not exists',400));
   }
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: product._id, quantity: 1 }],
        });
    }else {
        const existingItem = cart.cartItems.find(item => item.product.toString() === product_id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.cartItems.push({ product: product_id });
        }

        await cart.save();
    }
    return jsonResponse(res,{"cart":cart},'product added to cart')
});

const increaseDecrease= asyncHandler(async (req,res,next)=>{
    const {product_id,quantity} = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if(!cart){
        return next(new ApiError('user not have cart yet',400));
    }
    const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === product_id);
    if (itemIndex === -1) {
        return next(new ApiError('Product not found in cart', 404));
    }

    cart.cartItems[itemIndex].quantity = quantity;

    // remove product from cart
    if (cart.cartItems[itemIndex].quantity <= 0) {
        cart.cartItems.splice(itemIndex, 1);
    }
    await cart.save();
    // check cartItems if empty
    if(cart.cartItems.length < 1){
      await  cart.deleteOne();
    }

    return  jsonResponse(res,[],'cart updated successfully');
});

const clearCart = asyncHandler(async (req,res,next)=>{
    const cart = await Cart.findOne({ user: req.user._id });
    if(!cart){
        return next(new ApiError('user not have cart yet',400));
    }
    await cart.deleteOne();
    return jsonResponse(res,null,'cart cleared successfully');
});

const applyCoupon = asyncHandler(async (req,res,next)=>{
    const cart = await Cart.findOne({ user: req.user._id });
    if(!cart){
        return next(new ApiError('user not have cart yet',400))
    }
   const code = req.body.coupon;
    const coupon = await Coupon.findOne({
        code: code,
        status: true,
        expire:{$gte:new Date()},
        $expr: { $lt: ["$usage_number", "$max_limit"] }
    });
    if(!coupon){
        return  next(new ApiError('coupon code is invalid , or may be expired',400));
    }
    // check if user used coupon
    if(coupon.users.find((item) =>  item.equals(req.user._id))){
        return next(new ApiError('You have already used this coupon.',400));
    }

    coupon.users.push(req.user._id);
    coupon.usage_number += 1;
    await coupon.save();

    const prices = await cartPrice(cart,coupon.discount);
    cart.coupon = coupon._id;
    cart.total_price = prices.total_price;
    cart.total_price_after_discount = prices.total_price_after_discount;
    await cart.save();

    return jsonResponse(res,{"cart":await CartResource(cart)});

});

module.exports={index,addToCart,increaseDecrease,clearCart,applyCoupon}
