const ApiError = require("../utils/apiError");

exports.adminRoutes = (req,res,next)=>{
    if(req.user.role !=='admin'){
        return next(new ApiError('unauthorized',403))
    }
    next();
}