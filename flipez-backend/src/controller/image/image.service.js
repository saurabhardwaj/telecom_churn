const multer = require('multer');
const Image = require('./image.model');

const saveImage = (body) => {
    const image = new Image(body);
    return image.save();
}

module.exports = {
    saveImage
}