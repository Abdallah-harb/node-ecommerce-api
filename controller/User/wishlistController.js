const User = require('../../models/usermodel');
const ApiError = require("../../utils/apiError");
const asyncHandler = require('express-async-handler')

const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const user = await User.findById(req.user._id).select('wishlist').populate({
                                                                 path: 'wishlist',model: 'Product',select:"_id name slug main_image images",
                                                                options: {skip,limit }});

    const totalUser = await User.findById(req.user._id).select('wishlist');
    const total = totalUser.wishlist.length;
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'wishlist':user.wishlist,"pagination":pagination})
});

const add = asyncHandler(async (req,res)=>{
    //$addToSet add product if not exists if it exists keep it
    const productId = req.body.product_id;
    const user = await User.findByIdAndUpdate(req.user._id,
        {$addToSet: {wishlist:productId}},
        {new:true});
    return jsonResponse(res,{"wishlist":user.wishlist},'product add to wishlist');
});

const remove = asyncHandler(async (req,res)=>{
    //$pull remove product if not exists if it not in ignore it
    const productId = req.body.product_id;
    const user = await User.findByIdAndUpdate(req.user._id,
        {$pull: {wishlist:productId}},
        {new:true});
    return jsonResponse(res,{"wishlist":user.wishlist},'product add to wishlist');
});

const destroy = asyncHandler(async (req,res)=>{

    const user = await User.findByIdAndUpdate(req.user._id,
        {$set: {wishlist:[]}},
        {new:true});
    return jsonResponse(res,{"wishlist":user.wishlist},'wishlist cleared successfully');
});


module.exports={index,add,remove,destroy}
