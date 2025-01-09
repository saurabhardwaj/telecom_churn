const express = require('express');

const router = express.Router();

const validator = require('../../lib/validator/validator');
const user = require('../../controller/user');
const schemas = require('../../controller/user/schema');

router.get('/me/',  user.get);
router.get('/all', user.getAll);
router.put('/me/', validator(schemas.editSchema), user.edit);
router.put('/me/clear', user.clearSession);

module.exports = router;
