const express = require('express');
// const passport = require('passport');

const router = express.Router();

const validator = require('../../lib/validator/validator');
const authController = require('../../controller/authentication');
const publicController = require('../../controller/public');
const schemas = require('../../controller/authentication/schema');
const isAuthenticated = require('../../lib/auth/isAuthenticated');

router.post('/signup', validator(schemas.signupSchema), authController.signup);
router.post('/signin', validator(schemas.loginSchema), authController.login);
router.post('/signin/:provider', validator(schemas.socialLoginSchema), authController.login);
router.post('/forgot-password', validator(schemas.forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validator(schemas.resetPasswordSchema), authController.resetPassword);
router.patch('/change-password', isAuthenticated, validator(schemas.changePasswordSchema), authController.changePassword);
router.patch('/verify-code', isAuthenticated, validator(schemas.verifyCodeSchema), authController.verifyCode);
router.patch('/resend-verification-code', isAuthenticated, authController.resendVerificationCode);
router.post('/logout', authController.logout);

router.get('/city/:stateCode', publicController.getCity);
router.get('/state', publicController.getState);
router.get('/address', isAuthenticated, publicController.getAddress);
module.exports = router;
