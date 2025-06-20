import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 5000;

const allowedOrigins = [process.env.ALLOWED_ORIGIN];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_KEY,
});

app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: "black-forest-labs/flux-schnell",
      prompt,
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      return res.status(400).json({ error: "No image generated" });
    }

    return res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error.message);
    return res.status(500).json({ error: "Image generation failed" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

