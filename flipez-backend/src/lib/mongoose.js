/**
 * Wrapper for mongoose
 */

const mongoose = require('mongoose');

module.exports = {
  connect: async () => {
    const url = process.env.MONGO_URL;
    return mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  disconnect: async () => mongoose.disconnect(),
  mongoose,
};
