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

});


module.exports={cashOrder,paymentOrder}

