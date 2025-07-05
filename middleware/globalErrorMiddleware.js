const globalErrorMiddleware = (err,req,res,next)=>{
    if (process.env.APP_ENV === 'local'){
        errorDevelopmentMode(err,res);
    }else {
        errorProductionMode(err,res);
    }
}

const errorDevelopmentMode = (err,res)=>{
    err.statusCode = err.statusCode || 500;
    return errorResponse(res, err.message, {'error' : err,"slack" : err.stack} ,err.statusCode);
}

const errorProductionMode = (err,res)=>{
    err.statusCode = err.statusCode || 500;
    return errorResponse(res, err.message, null ,err.statusCode);
}
module.exports = globalErrorMiddleware