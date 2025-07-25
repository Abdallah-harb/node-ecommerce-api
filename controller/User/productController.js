const Product = require('../../models/productModel')
const {ProductResource,ProductCollectionResource} = require('../../resource/products/productResource');
const asyncHandler = require('express-async-handler');
const ApiError = require("../../utils/apiError");

const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;

    //filtering
    const filter = {};
    if (req.query.name) filter.name = { $regex: req.query.name, $options: 'i' };  // i for case sensitive
    if (req.query.price) filter.price = {$gte:req.query.price};
    if (req.query.ratting_average) filter.ratting_average = {$gte:req.query.ratting_average};

    // keyword search filed
    if (req.query.keyword) {
        filter.$or=[
            {name:{$regex: req.query.keyword,$options: 'i'}},
            {description:{$regex: req.query.keyword,$options: 'i'}}
        ];
    }

    let sort = '-createdAt';  // -  mean from new to oldest
    if (req.query.sort) {
        sort = req.query.sort;
    }


    const products = await Product.find(filter)
        .sort(sort)
        .skip(skip).limit(limit)
        .populate({path:'category',select:'_id name slug'})
        .populate({path:'brand',select:'_id name slug'});

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'products':ProductCollectionResource(products),"pagination":pagination})
});


const show = asyncHandler(async (req,res,next)=>{
    const slug = req.params.slug;

    const product = await Product.findOne({slug:slug})
        .populate({path:'category',select:'_id name slug'})
        .populate({path:'brand',select:'_id name slug'});
    if (!product){
        return   next(new ApiError(`product not found `,404));
    }

    return jsonResponse(res,{'product':ProductResource(product)})
});


module.exports = {index,show}