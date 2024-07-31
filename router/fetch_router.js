const express = require("express");
const router = express.Router();

const Image = require("../models/file")

router.get("/", (req, res) => {
  Image.aggregate([{ $sample: { size: 1 } }])
    .then((randomImage) => {
      if (randomImage.length === 0) {
        return res.status(404).send("No files found.");
      }
      console.log(randomImage[0]);
      res.json(randomImage[0]);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send("Error fetching file.");
    });
});

router.get("/multiple", (req, res) => {
  const count = parseInt(req.query.count) || 1;
  
    Image.aggregate([{ $sample: { size: count } }])
      .then((randomImages) => {
        if (randomImages.length === 0) {
          return res.status(404).send("No files found.");
        }
        res.json(randomImages);
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send("Error fetching file.");
      });
  });
  
  router.get("/all/pages/:index", (req, res) => {
    const pageIndex = parseInt(req.params.index, 10);
  
    if (isNaN(pageIndex) || pageIndex < 1) {
      return res.status(400).send("Invalid page index.");
    }
    const ITEMS_PER_PAGE = 10;
    Image.find({})
      .skip((pageIndex - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .then((page_results) => {
        if (page_results.length === 0) {
          return res.status(404).send("Page not found.");
        }
        Image.countDocuments()
          .then((total_images) => {
            const totalPages = Math.ceil(total_images / ITEMS_PER_PAGE);
            const formattedPageItems = page_results.map((image) => ({
              filename: image.filename,
              contentType: image.contentType,
              imageBuffer: image.imageBuffer
                ? image.imageBuffer.toString("base64")
                : "",
            }));
            const response = {
              page: pageIndex,
              totalPages: totalPages,
              files: formattedPageItems,
            };
            res.json(response);
          })
          .catch((error) => {
            console.error("Error counting Documents:", error);
            res.status(500).send("Error fetching files.");
          });
      })
      .catch((error) => {
        console.error("Error Finding Documents:", error);
        res.status(500).send("Error fetching files.");
      });
  });
  

  router.get("/all", (req, res) => {
    Image.find()
      .then((allImages) => {
        if (allImages.length === 0) {
          return res.status(404).json({ error: "No files found." });
        }
        const formattedImages = allImages.map((image) => ({
          filename: image.filename,
          contentType: image.contentType,
          imageBuffer: image.imageBuffer
            ? image.imageBuffer.toString("base64")
            : "",
        }));
  
        res.json(formattedImages);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        res.status(500).json({ error: "Error fetching files." });
      });
  });
  
  


    
    


module.exports = router;
