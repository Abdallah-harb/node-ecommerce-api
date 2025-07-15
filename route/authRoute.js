const express = require('express')
const router = express.Router();
const authController = require('../controller/authController');
const {RegisterValidator,verifyCodeValidate,resendCodeVerifyValidate,loginValidate} = require('../validator/Auth/authValidator');
const profileController = require('../controller/profileController');
const {checkAuth} = require('../middleware/checkAuthMiddleware');
const {updateProfileValidator,changePasswordValidator} = require('../validator/Auth/profileValidator');

//auth routes
router.post('/auth/register',RegisterValidator,authController.register);
router.post('/auth/resend-code',resendCodeVerifyValidate,authController.resendCode);
router.post('/auth/verify-code',verifyCodeValidate,authController.verifyCode);
router.post('/auth/login',loginValidate,authController.login);


// sharedRoutes
router.get('/user',checkAuth,profileController.user);
router.put('/update-profile',checkAuth,profileController.userFile,profileController.resizeFile,
                    updateProfileValidator,profileController.updateProfile);

router.put('/change-password',checkAuth,changePasswordValidator,profileController.changePassword);


module.exports = router