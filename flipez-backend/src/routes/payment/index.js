const express = require('express');
const multer = require('multer');
const router = express.Router();

const paymentController = require('../../controller/payment');
const isAuthenticated = require('../../lib/auth/isAuthenticated');

router.post('/session', isAuthenticated, paymentController.getCheckoutSession);

module.exports = router;
