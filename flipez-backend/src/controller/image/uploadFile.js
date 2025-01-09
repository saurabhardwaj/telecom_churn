const fs = require('fs');
const path = require('path');

const uploadFile = async (req) => {
    try {
        const pdfData = req.file.buffer;

        const folderPath = path.join(__dirname, '../../../upload', req.body.folderId);
        if(!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Save the PDF to a file (optional)
        const filePath = path.join(__dirname, '../../../upload', req.body.folderId, 'investment-memo.pdf');
        fs.writeFileSync(filePath, pdfData);
        return req.sendResponse(200, 'File uploaded successfully');
    } catch (error) {
        return req.sendResponse(500, error);
    }
    
}

module.exports = uploadFile;