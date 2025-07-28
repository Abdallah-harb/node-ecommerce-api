const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const ApiError = require("../../utils/apiError");
const checkOutHelper = require('../../utils/checkOutHelpier');
const mongoose = require("mongoose");
const Cart = require('../../models/cartModel');


const cashOrder = asyncHandler(async (req,res,next)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // get cart details
        const cart = await checkOutHelper.getCartDetails(req,res,next,session);
        // create-order
        await checkOutHelper.createOrder(cart,"cash",session);
        // empty-cart
        await Cart.deleteOne({ _id: cart._id }, { session });

        await session.commitTransaction();
        session.endSession();

        return jsonResponse(res,{},'order created successfully');
    }catch (e) {
        await session.abortTransaction();
        session.endSession();

        return next(new ApiError(e.message,500));
    }

});

const paymentOrder = asyncHandler(async (req,res,next)=>{
    // get cart
    const cart = await  checkOutHelper.getCartDetails(req,res,next);
    const total_amount =  cart.total_price_after_discount;

        // create stripe checkout
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: `Order for ${req.user.name}`,
                    },
                    unit_amount: total_amount * 100,
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/api/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/api/cart`,
        customer_email:req.user.email,
        client_reference_id:cart._id.toString(),
    });

    return jsonResponse(res,{session:session});
});


module.exports={cashOrder,paymentOrder}

