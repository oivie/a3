const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/file');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/upload.html'));
});

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const newImage = new Image({
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    imageBuffer: req.file.buffer,
  });

  newImage.save()
    .then(() => res.status(200).send('File uploaded successfully.'))
    .catch((error) => res.status(500).send('Error saving file to database.'));
});

router.get('/multiple', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/upload-multiple.html'));
});

router.post('/multiple', upload.array('files', 100), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const imagePromises = req.files.map((file) => {
    const newImage = new Image({
      filename: file.originalname,
      contentType: file.mimetype,
      imageBuffer: file.buffer,
    });
    return newImage.save();
  });

  Promise.all(imagePromises)
    .then(() => res.status(200).send('Files uploaded successfully.'))
    .catch((error) => res.status(500).send('Error saving files to database.'));
});

module.exports = router;
