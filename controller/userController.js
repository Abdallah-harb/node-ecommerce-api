const asyncHandler = require('express-async-handler');
const {uploadSingleFile} = require('../middleware/uploadFileMiddleware');
const sharp = require("sharp");
const { v4: uuidv4 } = require('uuid');
const User = require("../models/usermodel");
const {UserResource,UserCollectionResource} = require('../resource/user/userResource');
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");


const userFile = uploadSingleFile('image');

const resizeFile =  asyncHandler(async (req,file,next)=> {
    // No file uploaded — skip
    if (!req.file) {
        return next();
    }
    const fileName = `user_${uuidv4()}_${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`storage/upload/user/${fileName}`);

    req.body.image = fileName;

    next();
});


const index = asyncHandler(async (req,res)=>{
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit ;
    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const pagination = {
        total_items: total,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
    };

    return jsonResponse(res,{'users':UserCollectionResource(users),"pagination":pagination})
});

const show = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;

    const user = await User.findById(id);
    if(!user){
        return  next(ApiError('user not found ',404))
    }
    return jsonResponse(res,{'user':UserResource(user)});

});

const store = asyncHandler(async (req,res,next)=>{
    req.body.password = await bcrypt.hash(req.body.password,12);
    console.log(req.body)
    const user = await User.create(req.body);
    return jsonResponse(res,{'user':UserResource(user)});
});

const update = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id,req.body, {new: true});
    if (!user){
        return next(ApiError('user not found',404));
    }
    return jsonResponse(res,{"user":UserResource(user)});
});

const destroy = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user){
        return next(ApiError('user not found',404));
    }
    return  jsonResponse(res,[],'user deleted successfully');
});

const changeStatus = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        return next(new ApiError('user not found',404));
    }

    user.status = !user.status;
    await user.save();

    return  jsonResponse(res,[],'data update successfully');
});

module.exports={index,show,store,update,destroy,userFile,resizeFile,changeStatus};