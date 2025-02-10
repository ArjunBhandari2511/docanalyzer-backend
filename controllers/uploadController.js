const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid"); // Generate unique filenames

// Function to extract text from different document types.
const extractText = async (file) => {
    const mimeType = file.mimetype;
    
    if (mimeType === "application/pdf") {
        return pdfParse(file.buffer).then((data) => data.text);
    } 
    
    else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return mammoth.extractRawText({ buffer: file.buffer }).then((result) => result.value);
    } 
    
    else if (mimeType.startsWith("image/")) {
        // Generate a unique filename for the image
        const imageName = `${uuidv4()}.png`;  
        const imagePath = path.join(__dirname, "../uploads", imageName);

        // Ensure file is saved before running OCR
        await fs.writeFile(imagePath, file.buffer);

        // Run OCR
        const { data } = await Tesseract.recognize(imagePath, "eng");

        // Cleanup: Delete image after processing
        await fs.unlink(imagePath);

        return data.text;
    } 
    
    else {
        throw new Error("Unsupported file type");
    }
};

// Controller to handle file upload and text extraction
const processFile = async (req, res) => {
    try {
        console.log("Received request:", req.body); // Log request body
        console.log("Received file:", req.file);   // Log uploaded file
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("Processing file:", req.file.originalname);

        const extractedText = await extractText(req.file);
        res.json({ text: extractedText });

    } catch (error) {
        console.error("Error extracting text:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processFile };
