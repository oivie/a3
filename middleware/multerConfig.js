const multer = require("multer");
const getFormattedDateTime = require("../util/dateTimeUtil");

// Use memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only specific file types if needed
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 10 } // 10MB file size limit
});

module.exports = upload;
