const fs = require("fs");
const path = require("path");

const downloadFile = async (req, res) => {
  try {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=investment-memo.pdf`
    );

    // Pipe the file stream to the response object
    const filePath = path.join(
      __dirname,
      "../../../upload",
      req.query.folderId,
      "investment-memo.pdf"
    );
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    return req.sendResponse(500, error);
  }
};

module.exports = downloadFile;
