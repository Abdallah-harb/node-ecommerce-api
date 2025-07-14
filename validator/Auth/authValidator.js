const {body, check} = require('express-validator');
const User = require("../../models/usermodel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.RegisterValidator = [
   body('name').notEmpty().withMessage('name filed is required').bail()
       .isString().withMessage('name filed must be String')
       .isLength({max:100}).withMessage('max length is 100 char '),

    body('email').notEmpty().withMessage('email filed is required').bail()
        .isEmail().withMessage('email filed must be email')
        .custom(async (value)=>{
            const checkEmail = await User.findOne({email:value});
            if (checkEmail){
                throw new Error('email is already be token ')
            }
            return true
        }),

    body('password').notEmpty().withMessage('password filed is required').bail()
        .isLength({min:6}).withMessage('min length is 6  char ')
        .isLength({max:100}).withMessage('max length is 100 char'),

    body('password_confirmation').custom((value,{req})=>{
        if (value !== req.body.password){
            throw new Error('password not match')
        }
        return true
    }),

    validatorMiddleware
];

exports.resendCodeVerifyValidate = [
    body('email').notEmpty().withMessage('email filed is required').bail()
        .isEmail().withMessage('email filed must be email')
        .custom(async (value)=>{
            const checkEmail = await User.findOne({email:value});
            if (!checkEmail){
                throw new Error('please enter a Right  email');
            }
            return true
        }),
];

exports.verifyCodeValidate = [
    body('email').notEmpty().withMessage('email filed is required').bail()
        .isEmail().withMessage('email filed must be email')
        .custom(async (value)=>{
            const checkEmail = await User.findOne({email:value});
            if (!checkEmail){
                throw new Error('please enter a Right  email');
            }
            return true
        }),

    body('code').notEmpty().withMessage('code filed is required').bail()
        .isNumeric()
];

exports.loginValidate = [
    body('email').notEmpty().withMessage('email filed is required').bail()
        .isEmail().withMessage('email filed must be email')
        .custom(async (value)=>{
            const checkEmail = await User.findOne({email:value});
            if (!checkEmail){
                throw new Error('please enter a Right  email');
            }
            return true
        }),

    body('password').notEmpty().withMessage('password filed is required').bail()
        .isLength({max:100}).withMessage('max length is 100 char'),
]