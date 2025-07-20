const {check} = require('express-validator');
const validatorMiddleware = require("../middleware/validatorMiddleware");

exports.addressValidator = [
    check('alies').notEmpty().withMessage('alies filed is required').bail()
        .isLength({max:100}).withMessage('max length is 100 char').bail()
        .isLength({min:2}).withMessage('min length is 2  char'),

    check('country').notEmpty().withMessage('country filed is required'),
    check('city').notEmpty().withMessage('country filed is required'),
    check('details').notEmpty().withMessage('details filed is required').bail()
        .isLength({max:300}).withMessage('max length is 300 char').bail()
        .isLength({min:10}).withMessage('min length is 10 char'),
    validatorMiddleware
];

exports.addressIdValidator = [
    check('id').isMongoId().withMessage('invalid id format,please enter valid id'),
    validatorMiddleware
];