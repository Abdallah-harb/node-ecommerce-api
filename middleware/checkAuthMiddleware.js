const jwt = require('jsonwebtoken');
const ApiError = require("../utils/apiError");
const User = require('../models/usermodel');
const asyncHandler = require('express-async-handler');
exports.checkAuth = asyncHandler(async (req,res,next)=>{

    const authHeader = req.header('authorization') || req.header('Authorization')
    if (!authHeader){
        return next(new ApiError('unauthenticated',401));
    }
    const token = authHeader.split(" ")[1];
    if (!token){
        return next(new ApiError('unauthenticated',401));
    }
    try {
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await User.findById(verifyToken.id);

        if (!user){
            return next(new ApiError('the user that belong to token , not exists',401));
        }
        req.user = user;
        next();
    }catch (e) {
        if (e.name === 'TokenExpiredError') {
            return next(new ApiError('unauthenticated',401))
        }
        return next(new ApiError(e.message,500));
    }
})