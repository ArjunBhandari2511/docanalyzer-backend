const Groq = require("groq-sdk");
require("dotenv").config();

// Import AI modules
const { extractTextFromImageOrPDF } = require("../models/ocr");
const { summarizeText, extractEntities } = require("../models/nlp");
const { analyzeSentiment } = require("../models/sentiment");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Function to analyze text using Groq AI
const analyzeText = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file); 

        let extractedText = req.body.text || "";

        // If a file is uploaded, extract text using OCR
        if (req.file) {
            extractedText = await extractTextFromImageOrPDF(req.file); // Use Buffer instead of file path
        }

        if (!extractedText || typeof extractedText !== "string" || extractedText.trim().length === 0) {
            return res.status(400).json({ error: "Invalid input: No valid text provided for analysis." });
        }

        // Perform NLP tasks
        const summary = await summarizeText(extractedText);
        const entities = await extractEntities(extractedText);
        const sentiment = await analyzeSentiment(extractedText);

        // Send text to Groq AI LLM
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: extractedText.trim() }],
            model: "llama-3.3-70b-versatile",
        });

        // Extract AI response
        const aiResponse = chatCompletion.choices?.[0]?.message?.content || "No response from AI.";

        res.json({
            analysis: aiResponse,
            summary,
            entities,
            sentiment,
        });

    } catch (error) {
        console.error("Error analyzing text:", error?.response?.data || error.message);
        res.status(500).json({
            error: "Failed to analyze text using Groq AI.",
            details: error?.response?.data || error.message,
        });
    }
};

module.exports = { analyzeText };
