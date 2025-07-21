const express = require('express')
const router = express.Router();
const wishlistController = require('../controller/User/wishlistController');
const {wishlistValidator} = require('../validator/wishlistValidator');
const addressController = require('../controller/User/addressController');
const {addressValidator,addressIdValidator} = require('../validator/addressValudator');
const {IncreaseDecreseCartValidator} = require('../validator/cartValidator')
const cartController = require('../controller/User/cartController');
const categoryController = require('../controller/User/categoryController');
const productController = require('../controller/User/productController');
const reviewController = require("../controller/Admin/reviewController");
const {ReviewValidate, ValidateReviewId} = require("../validator/reviewValidator");


//category
router.get('/categories',categoryController.index)
router.get('/categories/:slug',categoryController.show);

//products routes
router.get('/products',productController.index);
router.get('/products/:slug',productController.show)

//wishlist
router.route('/wishlist')
    .get(wishlistController.index)
    .post(wishlistValidator,wishlistController.add)
    .put(wishlistValidator,wishlistController.remove)
    .delete(wishlistController.destroy);

// address
router.route('/address')
    .get(addressController.index)
    .post(addressValidator,addressController.add)

router.delete('/address/:id',addressIdValidator,addressController.remove);


// cart routes
router.route('/cart')
    .get(cartController.index)
    .post(cartController.addToCart)
    .delete(cartController.clearCart);
router.put('/cart/increase-decrease',IncreaseDecreseCartValidator,cartController.increaseDecrease);

// review
router.post('/reviews',ReviewValidate,reviewController.store)
router.get('/product/:id/review',ValidateReviewId,reviewController.productReview);



module.exports = router