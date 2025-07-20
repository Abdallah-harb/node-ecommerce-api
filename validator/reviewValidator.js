const {check,body} = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Product = require('../models/productModel')
exports.reviewIdValidator = [
    check('id').isMongoId().withMessage('invalid id format,please enter valid id'),
    validatorMiddleware
];

exports.reviewValidator = [
    body('review').notEmpty().withMessage('content filed is required').bail()
        .isLength({min:5}).withMessage('min Length is 5 char')
        .isLength({max:200}).withMessage('max length is 200 char'),

    body('rate').notEmpty().withMessage('rate filed is required').bail()
        .isNumeric().withMessage('rate must be number ')
        .isFloat({ min: 1, max: 5 }).withMessage('Rate must be between 1 and 5'),
    body('product').notEmpty().withMessage('product id is required').bail()
        .isMongoId().withMessage('id format not valid')
        .custom(async (value)=>{
            const product = await Product.findById(value);
            if (!product){
                throw new Error('product not fount ')
            }
            return true
        })
]
