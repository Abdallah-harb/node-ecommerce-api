const Category = require('../models/categoryModel')
const slugify = require('slugify');
const {CategoryResource,CategoryCollectionResource} = require('../resource/Category/categoryResource');
const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");
const mongoose = require('mongoose');
const Product = require('../models/productModel');


const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const categories = await Category.find({'parent':null}).skip(skip).limit(limit).populate('children');
    const total = await Category.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'categories':CategoryCollectionResource(categories),"pagination":pagination})
})


const store = asyncHandler(async (req,res)=>{
    const {name,parent} = req.body;
    const category = await Category.create({name,'slug':slugify(name),parent});

    return jsonResponse(res,{'category':CategoryResource(category)});
});

const show = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const category = await Category.findById(id).populate('children');
    if (!category){
      return   next(new ApiError(`category not found `,404));
    }

   return jsonResponse(res,{'category':CategoryResource(category)})
});


const update = asyncHandler(async (req,res,next)=>{
    const {name,parent} = req.body;
    const {id} = req.params;
    const  category = await Category.findByIdAndUpdate({_id:id},{name,'slug':slugify(name),parent},{new:true});
    if (!category){
       return  next(new ApiError(`category not found `,404));
    }

    return jsonResponse(res,{'category':CategoryResource(category)});
});

const destroy = asyncHandler(async (req,res,next)=>{
    const {id} = req.params

    const category = await Category.findById(id).populate('children');
    if (!category){
        return  next(new ApiError(`category not found `,404));
    }
    const products = await Product.countDocuments({'category':id});

    if (category.children.length > 0 || products > 0 ){
        return next(new ApiError('can not delete category , already have sub-category or products related'))
    }

    await category.deleteOne();

    return jsonResponse(res,[],'category deleted successfully');
});



module.exports = {index,store,show,update,destroy}