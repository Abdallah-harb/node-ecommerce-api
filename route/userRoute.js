const express = require('express')
const router = express.Router();
const wishlistController = require('../controller/User/wishlistController');
const {wishlistValidator} = require('../validator/wishlistValidator');
const addressController = require('../controller/User/addressController');
const {addressValidator,addressIdValidator} = require('../validator/addressValudator');
const cartController = require('../controller/User/cartController');
const {IncreaseDecreseCartValidator} = require('../validator/cartValidator')
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
router.put('/cart/increase-decrease',cartController.increaseDecrease);

module.exports = router