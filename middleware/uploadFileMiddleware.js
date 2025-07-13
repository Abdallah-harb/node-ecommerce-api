const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleFile=(file)=>{
    const memoryStorage = multer.memoryStorage();
    const multerFilter = function (req,file,cb){
        if (file.mimetype.startsWith('image')){
            cb(null,true);
        }else {
            cb(ApiError('only images are allowed',422));
        }
    }

    const upload = multer({ storage: memoryStorage,
        fileFilter: multerFilter,
        limits: {
            fileSize: 5 * 1024 * 1024  // 5mb
        }});

    return upload.single(file);
}


exports.uploadMultiFiles = (fields)=>{

    const memoryStorage = multer.memoryStorage();
    const multerFilter = function (req,file,cb){
        if (file.mimetype.startsWith('image')){
            cb(null,true);
        }else {
            cb(ApiError('only images are allowed',422));
        }
    }

    const upload = multer({ storage: memoryStorage,
        fileFilter: multerFilter,
        limits: {
            fileSize: 5 * 1024 * 1024  // 5mb
        }});

    return upload.fields(fields);

}