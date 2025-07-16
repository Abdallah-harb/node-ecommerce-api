const express = require('express')
const router = express.Router();
const categoryController = require('../controller/categoryController');
const {categoryIdValidator,storeCategoryValidator,updateCategoryValidator} = require("../validator/categoryValidator");
const brandController = require('../controller/brandController');
const {brandIdValidator,storeBrandValidator,updateBrandValidator} = require('../validator/brandValidator');
const productController = require('../controller/productController');
const {productIdValidator,storeProductValidator,updateProductValidator} = require('../validator/productValidator')
const userController = require('../controller/userController');
const {userIdValidator,storeUserValidator,updateUserValidate} = require('../validator/userValidator');


//user routes
router.route('/users')
    .get(userController.index)
    .post(userController.userFile,userController.resizeFile,storeUserValidator,userController.store);

router.route('/users/:id')
    .get(userIdValidator,userController.show)
    .put(userIdValidator,userController.userFile,userController.resizeFile,updateUserValidate,userController.update)
    .delete(userIdValidator,userController.destroy);

router.route('/users-status/:id')
    .patch(userIdValidator,userController.changeStatus);



// categories routes
router.route('/category')
    .get(categoryController.index)
    .post(categoryController.categoryUploadFile,categoryController.resizeFile,storeCategoryValidator,categoryController.store);

router.route('/category/:id')
    .get(categoryIdValidator,categoryController.show)
    .put(categoryController.categoryUploadFile,categoryController.resizeFile,
        categoryIdValidator,updateCategoryValidator,categoryController.update)
    .delete(categoryIdValidator,categoryController.destroy);



// brand routes
router.route('/brand')
    .get(brandController.index)
    .post(brandController.brandImage,brandController.resizeFile,storeBrandValidator,brandController.store);

router.route('/brand/:id')
    .get(brandIdValidator,brandController.show)
    .put(brandIdValidator,brandController.brandImage,brandController.resizeFile,updateBrandValidator,brandController.update)
    .delete(brandIdValidator,brandController.destroy);

// products routes
router.route('/product')
    .get(productController.index)
    .post(productController.productFiles,productController.resizeFiles,storeProductValidator,productController.store);

router.route('/product/:id')
    .get(productIdValidator,productController.show)
    .put(productIdValidator,productController.productFiles,productController.resizeFiles,
        updateProductValidator,productController.update)
    .delete(productIdValidator,productController.destroy);


module.exports = router