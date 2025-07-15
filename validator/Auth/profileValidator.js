const {body} = require('express-validator');
const User = require("../../models/usermodel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
exports.updateProfileValidator = [
    body('name').optional()
        .isString().withMessage('name filed must be String')
        .isLength({max:100}).withMessage('max length is 100 char '),

    body('email').optional()
        .isEmail().withMessage('email filed must be email')
        .custom(async (value,{req})=>{
            const checkEmail = await User.findOne({email:value,_id:{$ne:req.user._id}});
            if (checkEmail){
                throw new Error('email is already be token ')
            }
            return true
        }),

    body('phone').optional()
        .isMobilePhone('ar-EG').withMessage('phone filed must be valued phone number ')
        .custom(async (value,{req})=>{
            const checkPhone = await User.findOne({phone:value,id:{$ne:req.user._id}});
            if(checkPhone){
                throw new Error('phone number already token');
            }
            return true
        }),

    body('image').optional(),

    validatorMiddleware
];

exports.changePasswordValidator = [
    body('password').notEmpty().withMessage('password filed is required').bail()
        .isString().withMessage('must be string')
        .isLength({max:100}).withMessage('password max length is 100 char'),

    body('new_password').notEmpty().withMessage('new password filed is required').bail()
        .isString().withMessage('must be string')
        .isLength({min:6}).withMessage('mew password min length is 6 char')
        .isLength({max:100}).withMessage('new password max length is 100 char'),

    body('password_confirmation').notEmpty().withMessage('password confirmation is required').bail()
        .isString().withMessage('must be string')
        .custom((value,{req})=>{
            if(value !== req.body.new_password){
                throw new Error('password confirmation not match')
            }
            return true;
        }),

    validatorMiddleware
];