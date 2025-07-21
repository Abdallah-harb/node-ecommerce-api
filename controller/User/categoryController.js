const Category = require('../../models/categoryModel')
const {CategoryResource,CategoryCollectionResource} = require('../../resource/Category/categoryResource');
const asyncHandler = require('express-async-handler');
const ApiError = require("../../utils/apiError");


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
});

const show = asyncHandler(async (req,res,next)=>{
    const slug =req.params.slug;
   const category = await Category.findOne({slug:slug});
   if(!category){
       return next(new ApiError('category not found',404));
   }
   return  jsonResponse(res,{"category":CategoryResource(category)});
});

module.exports={index,show}