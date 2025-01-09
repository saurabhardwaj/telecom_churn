const mongoose = require("mongoose");

const ApiDataModelSchema = new mongoose.Schema(
  {
    zillowSearchAddressData: {},
    transitData: {},
    rehabResponse: { type: String },
    zillow4Address: {},
    zillowRentEstimate: {},
    address: { type: String },
    marketComparison: []
  },
  { timestamps: true }
);

ApiDataModelSchema.pre("find", function() {
  this.where({ isDeleted: { $ne: true } });
});

ApiDataModelSchema.pre("findOne", function() {
  this.where({ isDeleted: { $ne: true } });
});

ApiDataModelSchema.pre("count", function() {
  this.where({ isDeleted: { $ne: true } });
});

ApiDataModelSchema.pre("aggregate", function() {
  this._pipeline.unshift({ $match: { isDeleted: { $ne: true } } });
});

ApiDataModelSchema.statics.findAndUpdate = function(filter, update) {
  return this.findOneAndUpdate(filter, update, { new: true });
};

const ApiDataModel = mongoose.model(
  "ApiData",
  ApiDataModelSchema
);

module.exports = ApiDataModel;
