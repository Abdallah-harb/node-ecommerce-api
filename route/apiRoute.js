const express = require('express')
const router = express.Router();
const categoryController = require('../controller/categoryController');
const {categoryIdValidator,storeCategoryValidator,updateCategoryValidator} = require("../validator/categoryValidator");
const brandController = require('../controller/brandController');
const {brandIdValidator,storeBrandValidator,updateBrandValidator} = require('../validator/brandValidator');
const productController = require('../controller/productController');
const {productIdValidator,storeProductValidator} = require('../validator/productValidator')

// categories routes
router.route('/category')
    .get(categoryController.index)
    .post(categoryController.categoryUploadFile,categoryController.resizeFile,storeCategoryValidator,categoryController.store);

router.route('/category/:id')
    .get(categoryIdValidator,categoryController.show)
    .put(categoryController.categoryUploadFile,categoryController.resizeFile,categoryIdValidator,updateCategoryValidator,categoryController.update)
    .delete(categoryIdValidator,categoryController.destroy);



// brand routes
router.route('/brand')
    .get(brandController.index)
    .post(storeBrandValidator,brandController.store);

router.route('/brand/:id')
    .get(brandIdValidator,brandController.show)
    .put(brandIdValidator,updateBrandValidator,brandController.update)
    .delete(brandIdValidator,brandController.destroy);

// products routes
router.route('/product')
    .get(productController.index)
    .post(storeProductValidator,productController.store);

router.route('/product/:id')
    .get(productIdValidator,productController.show)
    .put(productIdValidator,storeProductValidator,productController.update)
    .delete(productIdValidator,productController.destroy);


module.exports = router