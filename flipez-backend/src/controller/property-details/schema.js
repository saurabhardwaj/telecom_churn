const Joi = require("joi");

const createSchema = Joi.object({
  propertyOverview: Joi.object({
    address: Joi.string()
      .required()
      .label("Address"),
    isHaveLiesOrEncumbrances: Joi.boolean()
      .required()
      .label("Is Have Lies Or Encumbrances"),
    initialPurchasePrice: Joi.number()
      .required()
      .label("Initial Purchase Price"),
    equity: Joi.number()
      .required()
      .label("Equity"),
  })
    .required()
    .label("Property Overview"),
});

const editSchema = Joi.object({
  _id: Joi.string()
    .required()
    .label("Property Id"),
  status: Joi.string()
      .optional(),
  propertyOverview: Joi.object({
    address: Joi.string()
      .optional()
      .allow(null, "")
      .label("Address"),
    isHaveLiesOrEncumbrances: Joi.boolean()
      .optional()
      .allow(null)
      .label("Is Have Lies Or Encumbrances"),
    initialPurchasePrice: Joi.number()
      .optional()
      .allow(null)
      .label("Initial Purchase Price"),
    equity: Joi.number()
      .optional()
      .allow(null)
      .label("Equity"),
  })
    .optional()
    .label("Property Overview"),
  loanDetails: Joi.object({
    loanAmount: Joi.number()
      .optional()
      .allow(null)
      .label("Loan Amount"),
    loanPosition: Joi.string()
      .optional()
      .allow(null, "")
      .label("Loan Position"),
  })
    .optional()
    .label("Property Overview"),
  borrowerInformation: Joi.object({
    fullName: Joi.string()
      .optional()
      .allow(null, "")
      .label("Full Name"),
    ficoScore: Joi.number()
      .optional()
      .allow(null, "")
      .label("Fico Score"),
    flipCompleteCount: Joi.string()
      .optional()
      .allow(null, "")
      .label("Flip Complete Count"),
  })
    .optional()
    .label("Property Overview"),
  rehabAssessment: Joi.object({
    demolitionStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Demolition Status"),
    debrisRemovalStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Debris Removal Status"),
    waterDamageStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Water Damage Status"),
    foundationStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Foundation Status"),
    roofStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Roof Status"),
    electricalStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Electrical Status"),
    hvacUpdateStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("HVAC Update Status"),
    willAddExtraBed: Joi.string()
      .optional()
      .allow(null, "")
      .label("Will Add Extra Bed"),
  })
    .optional()
    .label("Property Overview"),
  interiorDetails: Joi.object({
    dryWallStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Dry Wall Status"),
    floorStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Floor Status"),
    rePlaintStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Re-Plaint Status"),
    bathroomUpdateStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Bathroom Update Status"),
    landScrapingStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Land Scraping Status"),
    exteriorPaintingStatus: Joi.string()
      .optional()
      .allow(null, "")
      .label("Exterior Painting Status"),
  })
    .optional()
    .label("Property Overview"),
  lastCompleteStepNumber: Joi.number()
    .optional()
    .allow(null, "")
    .label("Last Complete Step Number"),
});

module.exports = {
  createSchema,
  editSchema,
};
