const express = require('express')
const router = express.Router();
const categoryController = require('../category/categoryController');

router.route('/category')
    .get(categoryController.index)
    .post(categoryController.store);

router.route('/category/:id')
    .get(categoryController.show)
    .put(categoryController.update)
    .delete(categoryController.destroy);


module.exports = router