const express = require("express");
const router = express.Router();
const path = require("path");
const multerConfig = require("../middleware/multerConfig");
const Image = require("../models/file");
const fs = require("fs");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/upload.html"));
});

router.post("/", multerConfig.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = path.join(__dirname, "../uploads", req.file.filename);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file from disk.");
    }

    const newImage = new Image({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      imageBuffer: data,
    });

    newImage.save()
      .then(() => res.status(200).send("File uploaded successfully."))
      .catch((error) => res.status(500).send("Error saving file to database."));
  });
});

router.get("/multiple", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/upload-multiple.html"));
});

router.post("/multiple", multerConfig.array("files", 100), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const filePromises = req.files.map((file) => {
    const filePath = path.join(__dirname, "../uploads", file.filename);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return reject(err);
        }

        const newImage = new Image({
          filename: file.originalname,
          contentType: file.mimetype,
          imageBuffer: data,
        });

        newImage.save()
          .then(resolve)
          .catch(reject);
      });
    });
  });

  Promise.all(filePromises)
    .then(() => res.status(200).send("Files uploaded successfully."))
    .catch((error) => res.status(500).send("Error saving files to database."));
});

module.exports = router;
