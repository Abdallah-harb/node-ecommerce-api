const asyncHandler = require('express-async-handler')
const {UserResource} = require('../resource/user/userResource');
const {uploadSingleFile} = require('../middleware/uploadFileMiddleware');
const sharp = require("sharp");
const fs = require('fs');
const path = require('path');
const ApiError = require("../utils/apiError");
const LoggerServices = require('../utils/Logger/LoggerServices');
const Logger = new LoggerServices('log');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs')

const userFile = uploadSingleFile('image');

const resizeFile =  asyncHandler(async (req,file,next)=> {

    // No file uploaded — skip
    if (!req.file) {
        return next();
    }
    const fileName = `user_${uuidv4()}_${Date.now()}.jpeg`;

    if (req.user?.image) {
        const oldImagePath = path.join(__dirname, '..', 'storage', 'upload', 'user', req.user.image);

        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Failed to delete old image:', err);
                });
            }
        });
    }

    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`storage/upload/user/${fileName}`);

    req.body.image = fileName;

    next();
});

const user = asyncHandler(async (req,res)=>{
    return jsonResponse(res,{'user': UserResource(req.user)});
});

const changePassword = asyncHandler(async (req,res,next)=>{
    const {password,new_password} = req.body;
    const user = req.user;

    const checkPassword  = await bcrypt.compare(password,user.password);
    if(!checkPassword){
        return next(new ApiError('password enter is invalid',400))
    }
    const hashPassword = await bcrypt.hash(new_password,12);
    user.password = hashPassword;
    user.password_changed_at = new Date();
    await user.save();

    return jsonResponse(res,[],"data updated successfully");
});

const updateProfile = asyncHandler(async (req,res,next)=>{
    const user = req.user;

    let sent = false;
    if ((req.body.email) && (req.body.email !== user.email)){
        try{
            await user.sentCodeVerification()
            sent = true;
            req.body.email_verified_at = null;
        }catch (e) {
            sent = false;
            Logger.handleError('register-sent-code', e);
            return next(new ApiError(`"sent" : ${sent} " " ${e.message}`,500));
        }
    }
    const image = req.body.image;
    if (image === '' || image === 'null' || image === null) {
        return next(new ApiError('image field cannot be empty', 400));
    }

    Object.assign(user, req.body);
    await user.save();

     return jsonResponse(res,{'user':UserResource(user)});
});

module.exports={user,changePassword,updateProfile,userFile,resizeFile}