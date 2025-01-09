const express = require('express');

const router = express.Router();

const validator = require('../../lib/validator/validator');
const investmentDetails = require('../../controller/investment-details');
const schemas = require('../../controller/investment-details/schema');

router.get('/', investmentDetails.getMyInvestmentDetails);
router.post('/', investmentDetails.create);
router.get('/completed', investmentDetails.getCompleted);
router.get('/initial-investment-opportunity', investmentDetails.getInitialInvestmentOpportunity);
router.get('/market-comparison', investmentDetails.getMarketComparison);
router.get('/neighborhood-details', investmentDetails.getNeighborhoodDetails);
router.patch('/update-rehab-value/:id', investmentDetails.updateRehabValue);
router.get('/all', investmentDetails.get);
router.patch('/:id', investmentDetails.edit);
router.get('/pdf/:id', investmentDetails.getPdf);

module.exports = router;
