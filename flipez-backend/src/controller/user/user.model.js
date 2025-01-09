const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../../lib/constant");

const UserModelSchema = new mongoose.Schema(
  {
    email: { type: String, lowerCase: true, unique: true },
    firstName: { type: String },
    phone: { type: String },
    lastName: { type: String },
    password: { type: String },
    verificationCode: { type: String },
    role: {
      type: String,
    },
    city: { type: String },
    state: { type: String },
    resetPasswordToken: { type: String, select: true },
    provider: [],
    previousPassword: [],
    image: {
      _id: false,
      url: { type: String },
      key: { type: String },
    },
    profilePic: {
      type: String,
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserModelSchema.pre("save", function() {
  this.updatedAt = new Date();
  if (this.password) {
    const SALT_FACTOR = 10;
    const salt = bcrypt.genSaltSync(SALT_FACTOR);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    this.previousPassword = [];
    this.previousPassword.push(this.password);
  }
  return Promise.resolve();
});

UserModelSchema.index({ email: 1 });

UserModelSchema.index({
  email: "text",
  firstName: "text",
  middleName: "text",
  surName: "text",
});

UserModelSchema.pre("find", function() {
  this.where({ isDeleted: { $ne: true } });
});

UserModelSchema.pre("findOne", function() {
  this.where({ isDeleted: { $ne: true } });
});

UserModelSchema.pre("count", function() {
  this.where({ isDeleted: { $ne: true } });
});

UserModelSchema.pre("aggregate", function() {
  this._pipeline.unshift({ $match: { isDeleted: { $ne: true } } });
});

UserModelSchema.statics.findAndUpdate = function(filter, update) {
  return this.findOneAndUpdate(filter, update, { new: true });
};

UserModelSchema.statics.comparePassword = function(password, password2) {
  return bcrypt.compareSync(password, password2);
};

const UserModel = mongoose.model("User", UserModelSchema);

module.exports = UserModel;
