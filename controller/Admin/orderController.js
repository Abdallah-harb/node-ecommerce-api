const Order = require('../../models/orderModel');
const asyncHandler = require('express-async-handler');
const {OrderResource,OrderCollectionResource} = require('../../resource/orders/orderResource');
const ApiError = require("../../utils/apiError");

const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const orders = await Order.find().skip(skip).limit(limit)
        .populate('order_details.product').populate('user');

    const total = await Order.find().countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };
    return jsonResponse(res,{orders:await OrderCollectionResource(orders),pagination:pagination});
});

const show = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const order = await Order.findById(id);
    if(!order){
        return next(new ApiError('order not founded',404));
    }
    return jsonResponse(res,{order:await OrderResource(order)});
});

const toggleStatus = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const order = await Order.findById(id);
    if(!order){
        return next(new ApiError('order not founded',404));
    }
    order.is_paid = !order.is_paid;
   await order.save();
   return jsonResponse(res,{order:await OrderResource(order)});
})

module.exports={index,show,toggleStatus}