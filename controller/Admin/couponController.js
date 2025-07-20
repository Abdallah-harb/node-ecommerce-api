const Coupon = require('../../models/couponModel');
const asyncHandler = require('express-async-handler');
const {CouponResource,CouponCollectionResource} = require('../../resource/coupon/couponResource');
const ApiError = require("../../utils/apiError");

const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const coupons = await Coupon.find().skip(skip).limit(limit);
    const total = await Coupon.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'coupons':CouponCollectionResource(coupons),"pagination":pagination})
});

const show = asyncHandler(async (req,res,next)=>{
    const {id} = req.params.id;
    const coupon = await Coupon.findById(id);
    if(!coupon){
        return next(new ApiError('these coupon not found',404));
    }
    return jsonResponse(res,{"coupon":CouponResource(coupon)});
});

const store = asyncHandler(async (req,res)=>{
    const {expire,max_limit,discount} = req.body;
    const coupon = new Coupon();
    coupon.expire = expire;
    coupon.max_limit = max_limit;
    coupon.discount = discount;
    await coupon.save();
    return jsonResponse(res,{"coupon":CouponResource(coupon)});
});

const update = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;

    const {expire,max_limit,discount} = req.body;
    const coupon = await Coupon.findByIdAndUpdate({_id:id}, {
        expire: expire,
        max_limit: max_limit,
        discount: discount
    },{new:true});
    if(!coupon){
        return next(new ApiError('these coupon not found',404));
    }
    return jsonResponse(res,{"coupon":CouponResource(coupon)});
});

const destroy = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const coupon = await Coupon.findByIdAndDelete(id)
    if(!coupon){
        return next(new ApiError('these coupon not found',404));
    }
    return jsonResponse(res,[],'data deleted successfully');

});

const toggleActive = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const coupon = await Coupon.findById(id);
    if(!coupon){
        return next(new ApiError('these coupon not found',404));
    }
    coupon.status = !coupon.status;
    await coupon.save();
    return jsonResponse(res,{"coupon":CouponResource(coupon)});
})
module.exports = {index,show,store,update,destroy,toggleActive}