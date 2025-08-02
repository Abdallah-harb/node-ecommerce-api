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
        const cart = await checkOutHelper.getCartDetails(req.user._id,next,session);
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
    const cart = await  checkOutHelper.getCartDetails(req.user._id,next);
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
        metadata: {
            customer_id: req.user._id.toString(),
        }
    });

    return jsonResponse(res,{session:session});
});


// listen to stripe webhook success or fail
const webhookCheckout = asyncHandler(async (req, res,next) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            const amount = await checkOutHelper.amountAfterPayment(session);

            // Get the cart ID passed in the checkout session
            const userID = session.metadata.customer_id;
            // Find the cart
            const cart = await checkOutHelper.getCartDetails(userID,next);
            // Create order from cart
            await checkOutHelper.createOrder(cart, 'credit',amount);

            // Delete the cart after successful order creation
            await Cart.deleteOne({ _id: cart._id });

            console.log('Order created and cart deleted');
        } catch (err) {
            console.error('Error during order creation from checkout session:', err.stack);
            return res.status(500).json({ error:err.message });
        }
    }

    res.status(200).json({ received: true });
});

module.exports={cashOrder,paymentOrder,webhookCheckout}

