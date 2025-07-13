const {check} = require('express-validator');
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Category = require('../models/categoryModel');
const Product = require('../models/brandModel');

exports.productIdValidator = [
    check('id').isMongoId().withMessage('invalid id format,please enter valid id'),
    validatorMiddleware
];

exports.storeProductValidator = [

    check('name').notEmpty().withMessage('name filed is required').bail()
        .isLength({min:3,max:100}).withMessage('min length is 3 char and max is 100 char'),

    check('description').notEmpty().withMessage('description filed is required ').bail()
        .isLength({min:10}).withMessage('min length for description is 10 char'),

    check('quantity').notEmpty().withMessage('quantity filed is required').bail()
        .isNumeric().withMessage('quantity filed must be number')
        .isLength({min:1}).withMessage('min length to quantity is 1'),

    check('colors')
        .optional()
        .isArray().withMessage('colors must be array'),

    check('price').notEmpty().withMessage('price filed is required').bail()
        .isNumeric().toFloat().withMessage('price filed must be  number'),

    check('price_after_discount').optional()
        .isNumeric().toFloat().withMessage('price filed must be  number')
        .custom((value,{req})=>{
            if (value >= req.body.price){
                throw new Error('price after discount must be less than price ')
            }
            return true
        }),

    check('category').notEmpty().withMessage('category filed must be required').bail()
        .isMongoId()
        .custom(async value=>{
            const category = await Category.findById(value);
            if (!category){
                throw new Error('category selected not found')
            }
            return true
        }),

    check('brand').optional()
        .isMongoId()
        .custom(async value=>{
            const brand = await Product.findById(value);
            if(!brand){
                throw  new Error('brand selected not found ')
            }
            return true
        }),
    check('main_image')
        .notEmpty().withMessage('main image filed is required'),

    check('images').optional().isArray().withMessage('images must be array'),

    validatorMiddleware

];


exports.updateProductValidator = [

    check('name').notEmpty().withMessage('name filed is required').bail()
        .isLength({min:3,max:100}).withMessage('min length is 3 char and max is 100 char'),

    check('description').notEmpty().withMessage('description filed is required ').bail()
        .isLength({min:10}).withMessage('min length for description is 10 char'),

    check('colors')
        .optional()
        .isArray().withMessage('colors must be array'),

    check('price').notEmpty().withMessage('price filed is required').bail()
        .isFloat().withMessage('price filed must be float number'),

    check('price_after_discount').optional()
        .isFloat().withMessage('price filed must be float number'),

    check('category').notEmpty().withMessage('category filed must be required').bail()
        .custom(async value=>{
            const category = await Category.findById(value);
            if (!category){
                throw new Error('category selected not found')
            }
            return true
        }),

    check('brand').optional()
        .custom(async value=>{
            const brand = await Product.findById(value);
            if(!brand){
                throw  new Error('brand selected not found ')
            }
            return true
        }),
    check('main_image')
        .optional(),

    check('images').optional().isArray().withMessage('images must be array'),

    validatorMiddleware
]