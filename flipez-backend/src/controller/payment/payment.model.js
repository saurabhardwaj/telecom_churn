const mongoose = require("mongoose");

const PaymentModelSchema = new mongoose.Schema(
  {
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentDetails" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number },
    stripe: {},
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PaymentModelSchema.pre("find", function() {
  this.where({ isDeleted: { $ne: true } });
});

PaymentModelSchema.pre("findOne", function() {
  this.where({ isDeleted: { $ne: true } });
});

PaymentModelSchema.pre("count", function() {
  this.where({ isDeleted: { $ne: true } });
});

PaymentModelSchema.pre("aggregate", function() {
  this._pipeline.unshift({ $match: { isDeleted: { $ne: true } } });
});

PaymentModelSchema.statics.findAndUpdate = function(filter, update) {
  return this.findOneAndUpdate(filter, update, { new: true });
};

const PaymentModel = mongoose.model(
  "Payment",
  PaymentModelSchema
);

module.exports = PaymentModel;
