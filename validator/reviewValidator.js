const {check} = require('express-validator');
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Product = require('../models/productModel');
exports.ValidateReviewId = [
    check('id').isMongoId().withMessage('invalid id format,please enter valid id'),
    validatorMiddleware
];

exports.ReviewValidate = [
    check('description').notEmpty().withMessage('description filed is required').bail()
        .isLength({max:200}).withMessage('max length for description is 200 char'),

    check('rate').notEmpty().withMessage('rate can not be empty').bail()
        .isNumeric().withMessage('Rate must be a number').bail()
        .isFloat({ min: 1, max: 5 }).withMessage('Rate must be between 1 and 5'),

    check('product').notEmpty().withMessage('product id is required').bail()
        .isMongoId().withMessage('product is is invalid')
        .custom(async (value)=>{
            const checkProduct = await Product.findById(value);
            if(!checkProduct){
                throw new Error('product id not found')
            }
            return true
        })
]