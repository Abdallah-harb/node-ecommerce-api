const Product = require('../models/productModel')
const slugify = require('slugify');
const {ProductResource,ProductCollectionResource} = require('../resource/products/productResource');
const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");


const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;

    const products = await Product.find().skip(skip).limit(limit)
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
})


const store = asyncHandler(async (req,res)=>{
    req.body.slug = slugify(req.body.name);
    const product = await Product.create(req.body);
    return jsonResponse(res,{'product':ProductResource(product)});
});

const show = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;

    const product = await Product.findById(id)
                                .populate({path:'category',select:'_id name slug'})
                                .populate({path:'brand',select:'_id name slug'});
    if (!product){
        return   next(new ApiError(`product not found `,404));
    }

    return jsonResponse(res,{'product':ProductResource(product)})
});


const update = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    req.body.slug = slugify(req.body.name);

    const  product = await Product.findByIdAndUpdate({_id:id},req.body,{new:true});
    if (!product){
        return  next(new ApiError(`product not found `,404));
    }

    return jsonResponse(res,{'product':ProductResource(product)});
});

const destroy = asyncHandler(async (req,res,next)=>{
    const {id} = req.params

    const product = await Product.findByIdAndDelete(id);
    if (!product){
        return  next(new ApiError(`product not found `,404));
    }

    return jsonResponse(res,[],'product deleted successfully');
});



module.exports = {index,store,show,update,destroy}