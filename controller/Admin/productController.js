const Product = require('../../models/productModel')
const slugify = require('slugify');
const {ProductResource,ProductCollectionResource} = require('../../resource/products/productResource');
const asyncHandler = require('express-async-handler');
const ApiError = require("../../utils/apiError");
const { v4: uuidv4 } = require('uuid');

const {uploadMultiFiles} = require('../../middleware/uploadFileMiddleware');
const sharp = require("sharp");

const productFiles = uploadMultiFiles([{name:'main_image',maxCount:1},{name: 'images[]',maxCount: 5}]);

const resizeFiles = asyncHandler(async (req,res,next)=>{

    if (req.files.main_image){
        const main_image = `product_${uuidv4()}_${Date.now()}_main.jpeg`;

        await sharp(req.files.main_image[0].buffer)
            .resize(2000,1333)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`storage/upload/product/${main_image}`);

            req.body.main_image = main_image;
    }

    if (req.files['images[]']){

        req.body.images =[];

        await Promise.all(req.files['images[]'].map(async (image, index) => {
            const imageName = `product_${uuidv4()}_${Date.now()}_${index}.jpeg`;

            await sharp(image.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({quality: 90})
                .toFile(`storage/upload/product/${imageName}`);

            req.body.images.push(imageName);
        }));
    }

    next();
});

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

    const product = await Product.findByIdAndUpdate({_id:id},req.body,{new:true});
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


module.exports = {index,store,show,update,destroy,productFiles,resizeFiles}