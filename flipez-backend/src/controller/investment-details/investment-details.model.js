const mongoose = require("mongoose");

const InvestmentDetailsModelSchema = new mongoose.Schema(
  {
    personalInformation: {
      firstName: { type: String },
      lastName: { type: String },
      companyName: { type: String },
      ficoScore: { type: Number },
      totalProjects: { type: Number },
      totalProjectsLastYear: { type: Number },
      descriptions: { type: String },
      emailId: { type: String },
      phoneNumber: { type: Number },
      profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
    },
    investmentOpportunity: {
      propertyAddress: { type: String },
      bedrooms: { type: Number },
      bathrooms: { type: Number },
      area: { type: Number },
      purchasePrice: { type: Number },
      contribution: { type: Number },
      estARV: { type: Number },
      loanAmount: { type: Number },
      loanToValue: { type: Number },
      loanTermYear: { type: Number },
      loanTermMonth: { type: Number },
      loanType: { type: String },
      loanPurpose: { type: String },
      loanPosition: { type: String },
      loanToARV: { type: String },
      propertyPhoto: { type: String },
      kitchenImage: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
      bathRoomImage: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
      bedRoomImage: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
      totalCost: { type: Number },
    },
    rehabAssessment: {
      kitchen: { 
        status: { type: String },
        cost: { type: Number },
      },
      bathRoom: { 
        status: { type: String },
        cost: { type: Number },
      },
      flooring: { 
        status: { type: String },
        cost: { type: Number },
      },
      interiorPainting: { 
        status: { type: String },
        cost: { type: Number },
      },
      exteriorPainting: { 
        status: { type: String },
        cost: { type: Number },
      },
      plumbing: { 
        status: { type: String },
        cost: { type: Number },
      },
      electrical: { 
        status: { type: String },
        cost: { type: Number },
      },
      landscaping: { 
        status: { type: String },
        cost: { type: Number },
      },
      hvac: { 
        status: { type: String },
        cost: { type: Number },
      },
      demolition: { 
        status: { type: String },
        cost: { type: Number },
      },
      roofing: { 
        status: { type: String },
        cost: { type: Number },
      },
      foundation: { 
        status: { type: String },
        cost: { type: Number },
      },
      extraBedBath: { 
        status: { type: String },
        cost: { type: Number },
      },
      totalCost: { type: Number },
    },
    previousProjects: {
      propertyAddress: { type: String },
      purchasePrice: { type: String },
      rehabCost: { type: Number },
      soldPrice: { type: Number },
      propertyPhoto: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
    },
    marketComparison: [], 
    neighborhoodDetails: {},
    lastCompleteStepNumber: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    propertyDetails: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyDetails" },
    isDeleted: { type: Boolean, default: false },
    zillowSearchAddressData: {},
    transitData: {},
    rehabResponse: { type: String },
    zillow4Address: {},
    zillowRentEstimate: {},
    investmentPotentialScore: {},
    status: { type: String, default: "pending" },
    additionalRehabs: [],
    isVisiblePotentialScore: { type: Boolean, default: true },
  },
  { timestamps: true }
);

InvestmentDetailsModelSchema.pre("find", function() {
  this.where({ isDeleted: { $ne: true } });
});

InvestmentDetailsModelSchema.pre("findOne", function() {
  this.where({ isDeleted: { $ne: true } });
});

InvestmentDetailsModelSchema.pre("count", function() {
  this.where({ isDeleted: { $ne: true } });
});

InvestmentDetailsModelSchema.pre("aggregate", function() {
  this._pipeline.unshift({ $match: { isDeleted: { $ne: true } } });
});

InvestmentDetailsModelSchema.statics.findAndUpdate = function(filter, update) {
  return this.findOneAndUpdate(filter, update, { new: true });
};

const InvestmentDetailsModel = mongoose.model(
  "InvestmentDetails",
  InvestmentDetailsModelSchema
);

module.exports = InvestmentDetailsModel;
