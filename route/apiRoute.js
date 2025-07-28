const express = require('express')
const router = express.Router();
const categoryController = require('../controller/Admin/categoryController');
const {categoryIdValidator,storeCategoryValidator,updateCategoryValidator} = require("../validator/categoryValidator");
const brandController = require('../controller/Admin/brandController');
const {brandIdValidator,storeBrandValidator,updateBrandValidator} = require('../validator/brandValidator');
const productController = require('../controller/Admin/productController');
const {productIdValidator,storeProductValidator,updateProductValidator} = require('../validator/productValidator')
const userController = require('../controller/Admin/userController');
const {userIdValidator,storeUserValidator,updateUserValidate} = require('../validator/userValidator');
const reviewController = require('../controller/Admin/reviewController');
const {ValidateReviewId,ReviewValidate} = require('../validator/reviewValidator');
const {CouponValidator,CouponIdValidator} = require('../validator/couponValidator');
const couponController = require('../controller/Admin/couponController');
const orderController = require('../controller/Admin/orderController');

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

//reviews routes
router.route('/reviews')
    .get(reviewController.index)
    .post(ReviewValidate,reviewController.store)

router.route('/reviews/:id')
    .get(ValidateReviewId,reviewController.show)
    .put(ValidateReviewId,ReviewValidate,reviewController.update)
    .delete(ValidateReviewId,reviewController.destroy);

router.patch('/review-togglesActive/:id',ValidateReviewId,reviewController.togglesActive)
router.get('/product/:id/review',ValidateReviewId,reviewController.productReview);


//coupon routes
router.route("/coupons")
    .get(couponController.index)
    .post(CouponValidator,couponController.store)
router.route("/coupons/:id")
    .get(CouponIdValidator,couponController.show)
    .put(CouponIdValidator,couponController.update)
    .patch(CouponIdValidator,couponController.toggleActive)
    .delete(CouponIdValidator,couponController.destroy);

//orders routes
router.get('/orders',orderController.index);
router.get('/orders/:id',orderController.show);
router.patch('/order-status/:id',orderController.toggleStatus);




module.exports = router