require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/upload");
const analyzeRoutes = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://docanalyzer-frontend.vercel.app",
  })
);
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/analyze", analyzeRoutes);

app.get("/", (req, res) => {
  res.send("SmartDoc API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
