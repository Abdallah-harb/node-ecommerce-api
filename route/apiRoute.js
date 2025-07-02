const express = require('express')
const router = express.Router();
const categoryController = require('../category/categoryController');

router.route('/category')
    .get(categoryController.index)
    .post(categoryController.store)

module.exports = router