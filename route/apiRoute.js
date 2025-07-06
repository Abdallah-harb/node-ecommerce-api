const express = require('express')
const router = express.Router();
const categoryController = require('../controller/categoryController');
const {categoryIdValidator,storeCategoryValidator,updateCategoryValidator} = require("../validator/categoryValidator");
const brandController = require('../controller/brandController');
const {brandIdValidator,storeBrandValidator,updateBrandValidator} = require('../validator/brandValidator');
// categories routes
router.route('/category')
    .get(categoryController.index)
    .post(storeCategoryValidator,categoryController.store);

router.route('/category/:id')
    .get(categoryIdValidator,categoryController.show)
    .put(categoryIdValidator,updateCategoryValidator,categoryController.update)
    .delete(categoryIdValidator,categoryController.destroy);

router.route('/category-details/:id')
    .get(categoryIdValidator,categoryController.subCategory)


// brand routes
router.route('/brand')
    .get(brandController.index)
    .post(storeBrandValidator,brandController.store);

router.route('/brand/:id')
    .get(brandIdValidator,brandController.show)
    .put(brandIdValidator,updateBrandValidator,brandController.update)
    .delete(brandIdValidator,brandController.destroy);

module.exports = router