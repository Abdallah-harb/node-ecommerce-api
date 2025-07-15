const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs');
const User = require('../models/usermodel');
const LoggerServices = require('../utils/Logger/LoggerServices');
const Logger = new LoggerServices('log');
const ApiError = require("../utils/apiError");
const jwt = require('jsonwebtoken');


const register = asyncHandler(async (req,res)=>{
    req.body.password = await bcrypt.hash(req.body.password,12);
    const user = await User.create(req.body);
    let sent = false;
    try{
       await user.sentCodeVerification()
        sent = true;
    }catch (e) {
        sent = false;
        Logger.handleError('register-sent-code', e);
    }

    return jsonResponse(res,{"sent":sent});
});

const resendCode = asyncHandler(async (req,res,next)=>{
    const {email} = req.body;
    const user = await User.findOne({email: email});

    if (user.email_verified_at !=null){
        return next(new ApiError('email already be verified'));
    }

    let sent = false;
    try{
        await user.sentCodeVerification()
        sent = true;
    }catch (e) {
        sent = false;
        Logger.handleError('register-sent-code', e);
    }


    return jsonResponse(res,{"sent":sent});
});

const verifyCode = asyncHandler(async (req,res,next)=>{

    const {email,code} = req.body;
    const user = await User.findOne({email: email});

    if (user.email_verified_at !=null){
        return next(new ApiError('email already be verified'));
    }
    const  checkCode = await bcrypt.compare(String(code),user.email_code_verified);
    if (!checkCode){
        return  next(new ApiError('code not match',400));
    }
    user.email_verified_at = new Date();
    await user.save();

    const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE_IN});

    return jsonResponse(res,{"token":token});
});

const login = asyncHandler(async (req,res,next)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email: email});
    const checkPassword = await bcrypt.compare(password,user.password)

    if(!user || !checkPassword){
        return next(new ApiError('credentials not match ',400));
    }
    const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE_IN});

    return jsonResponse(res,{"token":token});
});

module.exports={register,resendCode,verifyCode,login}

