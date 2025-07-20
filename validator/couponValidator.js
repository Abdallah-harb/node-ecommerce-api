const {check} = require('express-validator');
const validatorMiddleware = require("../middleware/validatorMiddleware");

exports.CouponValidator = [
    check('expire')
        .notEmpty().withMessage('expire field is required').bail()
        .isISO8601({ strict: true }).withMessage('expire must be a valid ISO 8601 datetime').bail()
        .custom((value) => {
            const inputDate = new Date(value);
            const now = new Date();
            if (inputDate < now) {
                throw new Error('expire must be greater than or equal to the current date and time');
            }
            return true;
        }),

    check('max_limit').notEmpty().withMessage('max limit filed is required').bail()
        .isNumeric().withMessage('max limit must be number ')
        .isLength({min:1}).withMessage('min limit is 1'),

    check('discount').notEmpty().withMessage('discount filed is required').bail()
        .isNumeric().withMessage('discount must be number ')
        .isLength({min:1}).withMessage('min length is 1')
        .isLength({max:100}).withMessage('max length is 100'),

    validatorMiddleware
];

exports.CouponIdValidator = [
    check('id').isMongoId().withMessage('invalid id format,please enter valid id'),
    validatorMiddleware
];