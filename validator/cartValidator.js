const {body} = require('express-validator')
const Product = require('../models/productModel');

exports.IncreaseDecreseCartValidator = [
    body('product_id').notEmpty().withMessage('product_id is required').bail()
        .isMongoId().withMessage('product id must be valid id')
        .custom(async (value)=>{
            const product = await Product.findById(value);
            if(!product){
                throw new Error('product not exist')
            }
            return true
        }),

    body('quantity').notEmpty().withMessage('quantity filed is required').bail()
        .isInt({ min: 0 }).withMessage('quantity must be at least 1')
        .toInt()

]