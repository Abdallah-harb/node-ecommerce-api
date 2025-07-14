const express = require('express')
const router = express.Router();
const authController = require('../controller/authController');
const {RegisterValidator,verifyCodeValidate,resendCodeVerifyValidate,loginValidate} = require('../validator/Auth/authValidator');

//auth routes
router.post('/register',RegisterValidator,authController.register);
router.post('/resend-code',resendCodeVerifyValidate,authController.resendCode);
router.post('/verify-code',verifyCodeValidate,authController.verifyCode);
router.post('/login',loginValidate,authController.login);



module.exports = router