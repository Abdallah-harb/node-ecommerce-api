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


// listen to stripe webhook success or fail
const webhookCheckout = asyncHandler(async (req,res)=>{
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        req.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(event.type);
    // Handle the event
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         const paymentIntent = event.data.object;
    //         console.log('PaymentIntent was successful!');
    //         break;
    //     case 'payment_method.attached':
    //         const paymentMethod = event.data.object;
    //         console.log('PaymentMethod was attached to a Customer!');
    //         break;
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a response to acknowledge receipt of the event
    // res.json({received: true});
});

module.exports={cashOrder,paymentOrder,webhookCheckout}

