const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageModelSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
}, { timestamps: true });

const ImageModel = mongoose.model('Image', ImageModelSchema);

module.exports = ImageModel;
