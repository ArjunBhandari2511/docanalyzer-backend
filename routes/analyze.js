const express = require("express");
const multer = require("multer");
const {analyzeText} = require("../controllers/analyzeController");

const router = express.Router();

// Multer storage (Temporary Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({
    storage : storage,
    limits : {fileSize : 10 * 1024 * 1024}, // 10 MB Limit
});

// Route to analyze the extracted Text
router.post("/" , upload.single("document") , analyzeText);

module.exports = router;