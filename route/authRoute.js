const express = require('express')
const router = express.Router();
const authController = require('../controller/authController');

//auth routes
router.post('/register',authController.register);
router.post('/resend-code',authController.resendCode);
router.post('/verify-code',authController.verifyCode);
router.post('/login',authController.login);



module.exports = router