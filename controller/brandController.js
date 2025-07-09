const Brand = require('../models/brandModel')
const slugify = require('slugify');
const {BrandResource,BrandCollectionResource}= require('../resource/brands/brandResource');
const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");
const Product = require('../models/productModel');

const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const brands = await Brand.find().skip(skip).limit(limit);
    const total = await Brand.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'brands':BrandCollectionResource(brands),"pagination":pagination})
})


const store = asyncHandler(async (req,res)=>{
    const {name} = req.body;
    const brand = await Brand.create({name,'slug':slugify(name)});

    return jsonResponse(res,{'brand':BrandResource(brand)});
});

const show = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const brand = await Brand.findById(id);
    if (!brand){
       return  next(new ApiError(`brand not found `,404));
    }

    return jsonResponse(res,{'brand':BrandResource(brand)});
});


const update = asyncHandler(async (req,res,next)=>{
    const {name} = req.body;
    const {id} = req.params;
    const  brand = await Brand.findByIdAndUpdate({_id:id},{name,'slug':slugify(name)},{new:true});
    if (!brand){
       return  next(new ApiError(`brand not found `,404));
    }

    return jsonResponse(res,{'brand':BrandResource(brand)});
});

const destroy = asyncHandler(async (req,res,next)=>{
    const {id} = req.params

    const brand = await Brand.findById(id);
    if (!brand){
        return  next(new ApiError(`brand not found `,404));
    }
    const products = await  Product.countDocuments({'brand':id});

    if(products && products > 0){
        return  next(ApiError('cannot deleted data as it contains products'));
    }

    return jsonResponse(res,[],'brand deleted successfully');
});

module.exports = {index,store,show,update,destroy}