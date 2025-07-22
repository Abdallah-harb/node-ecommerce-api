const {body} = require('express-validator');

exports.applyCouponValidator = [
    body('code').notEmpty().withMessage('coupon code is required').bail()
        .isString().withMessage('coupon code must be string').bail()
        .isLength({max:100}).withMessage('max length is 100 char')
]