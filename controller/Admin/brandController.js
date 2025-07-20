const Brand = require('../../models/brandModel')
const slugify = require('slugify');
const {BrandResource,BrandCollectionResource}= require('../../resource/brands/brandResource');
const asyncHandler = require('express-async-handler');
const ApiError = require("../../utils/apiError");
const Product = require('../../models/productModel');
const {uploadSingleFile} = require('../../middleware/uploadFileMiddleware');
const sharp = require("sharp");
const { v4: uuidv4 } = require('uuid');


const brandImage = uploadSingleFile('image');

const resizeFile =  asyncHandler(async (req,file,next)=> {
    const fileName = `brand_${uuidv4()}_${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`storage/upload/brand/${fileName}`);

    req.body.image=fileName;

    next();
});


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
    req.body.slug=slugify(name);
    const brand = await Brand.create(req.body);

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
    req.body.slug = slugify(name);

    const  brand = await Brand.findByIdAndUpdate({_id:id},req.body,{new:true});
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

module.exports = {index,store,show,update,destroy,brandImage,resizeFile}