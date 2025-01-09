const mongoose = require("mongoose");

const ConfigModelSchema = new mongoose.Schema(
  {
    key: { type: String },
    value: { type: String },
  },
  { timestamps: true }
);

ConfigModelSchema.pre("find", function() {
  this.where({ isDeleted: { $ne: true } });
});

ConfigModelSchema.pre("findOne", function() {
  this.where({ isDeleted: { $ne: true } });
});

ConfigModelSchema.pre("count", function() {
  this.where({ isDeleted: { $ne: true } });
});

ConfigModelSchema.pre("aggregate", function() {
  this._pipeline.unshift({ $match: { isDeleted: { $ne: true } } });
});

ConfigModelSchema.statics.findAndUpdate = function(filter, update) {
  return this.findOneAndUpdate(filter, update, { new: true });
};

const ConfigModel = mongoose.model(
  "Config",
  ConfigModelSchema
);

module.exports = ConfigModel;
