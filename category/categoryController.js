const Category = require('../models/categoryModel')
const slugify = require('slugify');
const {CategoryResource,CategoryCollectionResource} = require('../resource/Category/categoryResource');
const asyncHandler = require('express-async-handler');
const {response} = require("express");

const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const categories = await Category.find({}).skip(skip).limit(limit);
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
    const name = req.body.name;
    const category = await Category.create({name,'slug':slugify(name)});

    return jsonResponse(res,{'category':CategoryResource(category)});
});

const show = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const category = await Category.findById(id);
    if (!category){
        return errorResponse(res,"category not found ",null,404)
    }

   return jsonResponse(res,{'category':CategoryResource(category)})
});


const update = asyncHandler(async (req,res)=>{
    const {name} = req.body;
    const {id} = req.params;
    const  category = await Category.findByIdAndUpdate({_id:id},{name,'slug':slugify(name)},{new:true});
    if (!category){
        return errorResponse(res,"category not found ",null,404)
    }

    return jsonResponse(res,{'category':CategoryResource(category)});
});

const destroy = asyncHandler(async (req,res)=>{
    const {id} = req.params

    const category = await Category.findByIdAndDelete(id);
    if (!category){
        return errorResponse(res,"category not found ",null,404)
    }

    return jsonResponse(res,[],'category deleted successfully');
});


module.exports = {index,store,show,update,destroy}