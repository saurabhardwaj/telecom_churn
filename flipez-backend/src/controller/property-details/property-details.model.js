const mongoose = require("mongoose");

const PropertyDetailsModelSchema = new mongoose.Schema(
  {
    propertyOverview: {
      address: { type: String },
      isHaveLiesOrEncumbrances: { type: Boolean },
      initialPurchasePrice: { type: Number },
      equity: { type: Number },
    },
    loanDetails: {
      loanAmount: { type: Number },
      loanPosition: { type: String },
    },
    borrowerInformation: {
      fullName: { type: String },
      ficoScore: { type: Number },
      flipCompleteCount: { type: String },
    },
    rehabAssessment: {
      demolitionStatus: { type: String },
      debrisRemovalStatus: { type: String },
      waterDamageStatus: { type: String },
      foundationStatus: { type: String },
      roofStatus: { type: String },
      electricalStatus: { type: String },
      hvacUpdateStatus: { type: String },
      willAddExtraBed: { type: String },
    },
    interiorDetails: { 
      dryWallStatus: { type: String },
      floorStatus: { type: String },
      rePlaintStatus: { type: String },
      bathroomUpdateStatus: { type: String },
      landScrapingStatus: { type: String },
      exteriorPaintingStatus: { type: String },
    },
    lastCompleteStepNumber: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

PropertyDetailsModelSchema.pre("find", function() {
  this.where({ isDeleted: { $ne: true } });
});

PropertyDetailsModelSchema.pre("findOne", function() {
  this.where({ isDeleted: { $ne: true } });
});

PropertyDetailsModelSchema.pre("count", function() {
  this.where({ isDeleted: { $ne: true } });
});

PropertyDetailsModelSchema.pre("aggregate", function() {
  this._pipeline.unshift({ $match: { isDeleted: { $ne: true } } });
});

PropertyDetailsModelSchema.statics.findAndUpdate = function(filter, update) {
  return this.findOneAndUpdate(filter, update, { new: true });
};

const PropertyDetailsModel = mongoose.model(
  "PropertyDetails",
  PropertyDetailsModelSchema
);

module.exports = PropertyDetailsModel;
