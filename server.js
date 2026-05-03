import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ENV_API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    let { apiKey, ...geminiBody } = req.body;

    // Priority: 1. From frontend, 2. From .env
    const finalApiKey = apiKey?.trim() || ENV_API_KEY;

    if (!finalApiKey) {
      return res.status(400).json({ 
        error: "API key is required. Provide it in request or set GEMINI_API_KEY in .env" 
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${finalApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error"
      });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Alive Proxy running on http://localhost:3000");
  if (!ENV_API_KEY) {
    console.log("⚠️  GEMINI_API_KEY not found in .env");
  }
});