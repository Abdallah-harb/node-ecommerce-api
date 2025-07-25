const {check} = require('express-validator');
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Category = require('../models/categoryModel');
const Brand = require("../models/brandModel");
const slugify = require("slugify");

exports.categoryIdValidator = [
    check('id').isMongoId().withMessage('invalid id format,please enter valid id'),
    validatorMiddleware
];

exports.storeCategoryValidator = [
    check('name').notEmpty().withMessage('name filed is required').bail()
        .isLength({min:3,max:50}).withMessage('min length is 3 char and max is 50 char')
        .custom(async (value,{req})=>{
            const name = await Category.findOne({name:value});
            if (name){
                throw new Error('These category already exists');
            }
            req.body = slugify(value);
            return true
        }),
    check('sub').optional()
        .isBoolean().withMessage('checking sub value must be boolean and tru'),

    check('image').notEmpty().withMessage('image filed is required').bail()
        .custom((value,{req})=>{
           if(!req.file){
               throw new Error('image filed must be file');
           }
        }),

    check('parent')
        .if(check('sub').equals('true'))
        .notEmpty().withMessage('parent filed category is required').bail()
        .isMongoId().withMessage('invalid id format for parent category ,please enter valid id')
        .custom(async value=>{
            const parent = await Category.findById(value);
            if(!parent){
                throw new Error('parent Category Not Exist , please enter valid category')
            }
            return true
        }),

    check('parent')
        .if(check('sub').not().equals('true'))
        .custom((value) => {
            if (value) {
                throw new Error('Parent should not be provided for main categories');
            }
            return true
        }),

    validatorMiddleware

];
exports.updateCategoryValidator = [

    check('name').notEmpty().withMessage('name filed is required').bail()
        .isLength({min:3,max:50}).withMessage('min length is 3 char and max is 50 char')
        .custom(async (value, { req }) => {
            const name = await Brand.findOne({ name: value, _id: { $ne: req.params.id } });
            if (name) {
                throw new Error('This brand already exists');
            }
            req.body = slugify(value);
            return true;
        }),

    check('sub').optional()
        .isBoolean().withMessage('checking sub value must be boolean and tru'),

    check('parent')
        .if(check('sub').equals('true'))
        .notEmpty().withMessage('parent filed category is required').bail()
        .isMongoId().withMessage('invalid id format for parent category ,please enter valid id')
        .custom(async value=>{
            const parent = await Category.findById(value);
            if(!parent){
                throw new Error('parent Category Not Exist , please enter valid category')
            }
            return true
        }),

    check('parent')
        .if(check('sub').not().equals('true'))
        .custom((value) => {
            if (value) {
                throw new Error('Parent should not be provided for main categories');
            }
            return true
        }),

    validatorMiddleware
]