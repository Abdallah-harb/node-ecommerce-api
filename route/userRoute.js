const express = require('express')
const router = express.Router();
const wishlistController = require('../controller/User/wishlistController');
const {wishlistValidator} = require('../validator/wishlistValidator');


//wishlist
router.route('/wishlist')
    .get(wishlistController.index)
    .post(wishlistValidator,wishlistController.add)
    .put(wishlistValidator,wishlistController.remove)
    .delete(wishlistController.destroy)

module.exports = router