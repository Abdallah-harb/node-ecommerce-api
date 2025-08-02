const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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



const createOrder = asyncHandler(async (cart,pay_type,amount=null, session = null)=>{
    const orderDetails = await Promise.all(
        cart.cartItems.map(async item => {
            const product = await Product.findById(item.product).session(session);
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
    let total_amount = order.total_price_after_discount;
    if(amount){
        total_amount=amount
    }
    await createInvoice(order,total_amount);
});

const amountAfterPayment = asyncHandler(async (session) => {

    console.log('session from services:',session);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
        expand: ["charges.data.balance_transaction"],
    });

    const charge = paymentIntent.charges?.data[0];
    if (!charge || !charge.balance_transaction) {
        console.error("No charge or balance_transaction on paymentIntent:", paymentIntent);
        return null;
    }

    // 4) The expanded balance_transaction object
    const balanceTx = charge.balance_transaction;
    console.log("Gross amount:", balanceTx.gross); // in cents
    console.log("Stripe fees:", balanceTx.fee);    // in cents
    console.log("Net amount:", balanceTx.net);     // in cents

    // 5) Return the net in your chosen unit
    return balanceTx.net / 100;
});

const createInvoice = asyncHandler(async (order,amount, session = null) => {
    await Invoice.create([{ order: order._id,total_amount: amount}], { session });
});



module.exports={getCart,getCartDetails,createOrder,amountAfterPayment};


