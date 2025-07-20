const Review = require('../../models/reviewModel');
const asyncHandler = require('express-async-handler');
const {ReviewResource,ReviewCollectionResource} = require('../../resource/reviews/reviewResource');


const index =asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const reviews = await Review.find().skip(skip).limit(limit).populate('user').populate('product');
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
    return jsonResponse(res,{"reviews": await ReviewCollectionResource(reviews),'pagination':pagination});
});

const show = asyncHandler(async (req,res,next)=>{

});

const store = asyncHandler(async (req,res)=>{

});

const update = asyncHandler(async (req,res)=>{

});

const destroy = asyncHandler(async (req,res)=>{

});

module.exports={index,show,store,update,destroy}