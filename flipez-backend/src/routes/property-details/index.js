const express = require('express');

const router = express.Router();

const validator = require('../../lib/validator/validator');
const propertyDetails = require('../../controller/property-details');
const schemas = require('../../controller/property-details/schema');

router.get('/',  propertyDetails.getMyPropertyDetails);
router.post('/', validator(schemas.createSchema), propertyDetails.create);
router.patch('/:id', validator(schemas.editSchema), propertyDetails.edit);
router.post('/price', propertyDetails.getAddressPrice);

module.exports = router;
