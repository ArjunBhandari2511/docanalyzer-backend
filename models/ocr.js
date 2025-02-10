const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

// Function to determine if a file is a PDF or Image and extract text
const extractTextFromImageOrPDF = async (file) => {
    try {
        if (!file || !file.buffer || !file.mimetype) {
            throw new Error("Invalid input: File buffer or MIME type is missing.");
        }

        if (file.mimetype === "application/pdf") {
            // Extract text from PDF buffer
            const pdfData = await pdfParse(file.buffer);
            return pdfData.text;
        } else if (file.mimetype.startsWith("image/")) {
            // Extract text from image buffer using Tesseract
            const { data } = await Tesseract.recognize(file.buffer, "eng");
            return data.text;
        } else {
            throw new Error("Unsupported file type. Please upload a PDF or an image.");
        }
    } catch (error) {
        throw new Error("Error extracting text: " + error.message);
    }
};

module.exports = { extractTextFromImageOrPDF };
