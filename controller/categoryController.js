const Category = require('../models/categoryModel')
const slugify = require('slugify');
const {CategoryResource,CategoryCollectionResource} = require('../resource/Category/categoryResource');
const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");

const Product = require('../models/productModel');

const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp");
const {uploadSingleFile} = require('../middleware/uploadFileMiddleware');

const categoryUploadFile = uploadSingleFile('image');

const resizeFile =  asyncHandler(async (req,file,next)=> {
    const fileName = `category_${uuidv4()}_${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`storage/upload/category/${fileName}`);
         req.body.image=fileName;

    next();
});

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
     req.body.slug=slugify(name);
    const category = await Category.create(req.body);

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



module.exports = {index,store,show,update,destroy,categoryUploadFile,resizeFile}