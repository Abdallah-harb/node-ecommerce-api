const {check} = require('express-validator');
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Product = require('../models/productModel');

exports.wishlistValidator = [
    check('product_id').notEmpty().withMessage('product_id is required').bail()
        .isMongoId().withMessage('invalid id format,please enter valid id').bail()
    .custom(async (value)=>{
       const checkProduct = await Product.findById(value);
        if(!checkProduct){
            throw new Error('product not exists')
        }
        return true
    }),
    validatorMiddleware
];