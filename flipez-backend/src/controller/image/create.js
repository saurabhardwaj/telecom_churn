const { saveImage } = require('../image/image.service');

const create = async (req) => {
    const element = req.file;
    try {
        const imageJson = await saveImage({
            name: element.originalname,
            data: element.buffer,
            contentType: element.mimetype,
        });
        return req.sendResponse(200, imageJson);
    } catch (error) {
        return req.sendResponse(500, error);
    }
    
}

module.exports = create;