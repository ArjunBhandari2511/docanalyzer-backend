const express = require("express");
const multer = require("multer");
const {processFile} = require("../controllers/uploadController");

const router = express.Router();

// Set up the Multer Storage (Temporary Memory Storage)
const storage = multer.memoryStorage({
    filename : (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage : storage,
    limits : {fileSize : 10 * 1024 * 1024}, //10 MB limit
})



// Upload route (accepts PDF , DOCX , & Images)
router.post("/" , upload.single("document"), processFile);

module.exports = router;