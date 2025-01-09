const PropertyDetailsModel = require('./property-details.model');

const create = async (req) => {
  try {
    req.body.user = req.user._id;
    delete req.body._id;
    const data = await PropertyDetailsModel.findOne({ user: req.user._id, status: 'pending' }).lean();
    if(!data) {
      await PropertyDetailsModel.create(req.body);
    } else {
      await PropertyDetailsModel.findOneAndUpdate({ user: req.user._id, status: 'pending' }, { $set: req.body }, { new: true, upsert: true }).lean();
    }
    propertyDetails = await PropertyDetailsModel.findOne({ user: req.user._id, status: 'pending' }).lean();
    return req.sendResponse(200, propertyDetails);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = create;
"MongoServerError: Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: developerflipez-test.propertydetails index: _id_ dup key: { _id: ObjectId('674ff29b9d4f0c30bea982cc') }\n    at MessageStream.messageHandler (C:\\Users\\Dell\\OneDrive\\Documents\\code\\flipez\\flipez-backend\\node_modules\\mongodb\\lib\\cmap\\connection.js:462:30)\n    at MessageStream.emit (node:events:519:28)\n    at processIncomingData (C:\\Users\\Dell\\OneDrive\\Documents\\code\\flipez\\flipez-backend\\node_modules\\mongodb\\lib\\cmap\\message_stream.js:108:16)\n    at MessageStream._write (C:\\Users\\Dell\\OneDrive\\Documents\\code\\flipez\\flipez-backend\\node_modules\\mongodb\\lib\\cmap\\message_stream.js:28:9)\n    at writeOrBuffer (node:internal/streams/writable:570:12)\n    at _write (node:internal/streams/writable:499:10)\n    at Writable.write (node:internal/streams/writable:508:10)\n    at TLSSocket.ondata (node:internal/streams/readable:1007:22)\n    at TLSSocket.emit (node:events:519:28)\n    at addChunk (node:internal/streams/readable:559:12)"