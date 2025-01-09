const express = require('express');
const multer = require('multer');
const router = express.Router();

const imageController = require('../../controller/image');
const isAuthenticated = require('../../lib/auth/isAuthenticated');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', isAuthenticated, upload.single('image'), imageController.create);
router.post('/file', isAuthenticated, upload.single('image'), imageController.uploadFile);
router.get('/download', imageController.downloadFile);


module.exports = router;
