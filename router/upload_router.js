console.log('Initializing router');

const express = require("express");
const router = express.Router();
const path = require("path"); // Ensure path is imported here
const multerConfig = require("../middleware/multerConfig");
const Image = require("../models/file");

console.log('Router initialized, modules loaded');

router.get("/", (req, res) => {
  console.log('GET /');
  res.sendFile(path.join(__dirname, "../views/upload.html"));
});

router.post("/", multerConfig.single("file"), (req, res) => {
  console.log('POST /upload');
  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }

  const newImage = new Image({
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    imageBuffer: req.file.buffer, // Use buffer directly
  });

  newImage.save()
    .then(() => {
      console.log('File uploaded successfully');
      res.status(200).send("File uploaded successfully.");
    })
    .catch((error) => {
      console.error("Error saving file to database:", error);
      res.status(500).send("Error saving file to database.");
    });
});

router.get("/multiple", (req, res) => {
  console.log('GET /multiple');
  res.sendFile(path.join(__dirname, "../views/upload-multiple.html"));
});

router.post("/multiple", multerConfig.array("files", 100), (req, res) => {
  console.log('POST /upload/multiple');
  if (!req.files || req.files.length === 0) {
    console.error("No files uploaded.");
    return res.status(400).send("No files uploaded.");
  }

  const filePromises = req.files.map((file) => {
    const newImage = new Image({
      filename: file.originalname,
      contentType: file.mimetype,
      imageBuffer: file.buffer, // Use buffer directly
    });

    return newImage.save()
      .then(() => console.log(`File ${file.originalname} uploaded and saved successfully.`))
      .catch((error) => {
        console.error(`Error saving file ${file.originalname} to database:`, error);
        throw error;
      });
  });

  Promise.all(filePromises)
    .then(() => res.status(200).send("Files uploaded successfully."))
    .catch((error) => {
      console.error("Error saving files to database:", error);
      res.status(500).send("Error saving files to database.");
    });
});

module.exports = router;
