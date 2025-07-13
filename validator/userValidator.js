const {check} = require('express-validator');
const User = require('../models/usermodel');
const validatorMiddleware = require("../middleware/validatorMiddleware");

exports.userIdValidator = [
    check('id').isMongoId().withMessage('invalid id format,please enter valid id'),
    validatorMiddleware
]
exports.storeUserValidator =[
    check('name').notEmpty().withMessage('name filed is required').bail()
        .isString().withMessage('name filed must be String')
        .isLength({max:100}).withMessage('max length is 100 char '),

    check('email').notEmpty().withMessage('email filed is required').bail()
        .isEmail().withMessage('email filed must be email')
        .custom(async (value)=>{
            const checkEmail = await User.findOne({email:value});
            if (checkEmail){
                throw new Error('email is already be token ')
            }
            return true
        }),
    check('password').notEmpty().withMessage('password filed is required').bail()
        .isLength({min:6}).withMessage('min length is 6  char ')
        .isLength({max:100}).withMessage('max length is 100 char'),

    check('password_confirmation').custom((value,{req})=>{
        if (value !== req.body.password){
            throw new Error('password not match')
        }
        return true
    }),

    check('phone').optional()
        .isMobilePhone('ar-EG')
        .custom(async (value)=>{
            const checkPhone = await User.findOne({phone:value});
            if (checkPhone){
                throw Error('phone already be token ')
            }
        }),
    validatorMiddleware
];

exports.updateUserValidate = [
    check('name').notEmpty().withMessage('name filed is required').bail()
        .isString().withMessage('name filed must be String')
        .isLength({max:100}).withMessage('max length is 100 char '),

    check('email').notEmpty().withMessage('email filed is required').bail()
        .isEmail().withMessage('email filed must be email')
        .custom(async (value, { req }) => {
            const existingUser = await User.findOne({ email: value });

            if (existingUser && existingUser._id.toString() !== req.params.id) {
                throw new Error('Email already taken');
            }

            return true;
        }),
    check('phone').optional()
        .isMobilePhone('ar-EG')
        .custom(async (value)=>{
            const checkPhone = await User.findOne({phone:value});
            if (checkPhone && checkPhone._id.toString() !== req.params.id){
                throw Error('phone already be token ')
            }
            return true;
        }),
]

