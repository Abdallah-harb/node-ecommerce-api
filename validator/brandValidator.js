const {check} = require('express-validator');
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Brand = require('../models/brandModel');

exports.brandIdValidator = [
    check('id').isMongoId().withMessage('invalid id format,please enter valid id'),
    validatorMiddleware
];

exports.storeBrandValidator = [
    check('name').notEmpty().withMessage('name filed is required').bail()
        .isLength({min:3,max:50}).withMessage('min length is 3 char and max is 50 char')
        .custom(async value=>{
            const name = await Brand.findOne({name:value});
            if (name){
                throw new Error('These brand already exists');
            }
            return true
        }),
    validatorMiddleware
];

exports.updateBrandValidator = [
    check('name').notEmpty().withMessage('name filed is required').bail()
        .isLength({min:3,max:50}).withMessage('min length is 3 char and max is 50 char')
        .custom(async (value, { req }) => {
            const name = await Brand.findOne({ name: value, _id: { $ne: req.params.id } });
            if (name) {
                throw new Error('This brand already exists');
            }
            return true;
        }),
    validatorMiddleware
]