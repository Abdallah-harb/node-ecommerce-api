const Review = require('../../models/reviewModel');
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const {ReviewResource,ReviewCollectionResource} = require('../../resource/Review/reviewResource');

const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const reviews = await Review.find().skip(skip).limit(limit).populate('product').populate('user');
    const total = await Review.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'reviews':await ReviewCollectionResource(reviews),"pagination":pagination})
})


const store = asyncHandler(async (req,res)=>{

    const review = await Review.create({...req.body,user: req.user._id});

    return jsonResponse(res,[],'data created successfully');
});


//get review of product
const productReview = asyncHandler(async (req,res,next)=>{
    const productId = req.params.id;
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const reviews = await Review.find({product:productId}).skip(skip).limit(limit).populate('user');
    const total = await Review.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'reviews':await ReviewCollectionResource(reviews),"pagination":pagination})
})


module.exports = {index,store,show,update,destroy,togglesActive,productReview}