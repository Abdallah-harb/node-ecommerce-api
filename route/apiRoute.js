const express = require('express')
const router = express.Router();
const categoryController = require('../category/categoryController');
const {categoryIdValidator,storeCategoryValidator} = require("../validator/categoryValidator");

router.route('/category')
    .get(categoryController.index)
    .post(storeCategoryValidator,categoryController.store);

router.route('/category/:id')
    .get(categoryIdValidator,categoryController.show)
    .put(categoryIdValidator,categoryController.update)
    .delete(categoryIdValidator,categoryController.destroy);

router.route('/category-details/:id')
    .get(categoryIdValidator,categoryController.subCategory)

module.exports = router