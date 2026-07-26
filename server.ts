import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI lazily
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // API endpoint: AI Coach Performance Summary
  app.post("/api/ai-coach-summary", async (req, res) => {
    try {
      const ai = getAi();
      if (!ai) {
        return res.json({
          summary: "Luar biasa! Semua pemain telah berusaha dengan sangat baik. Tingkatkan terus kemampuan berhitung kalian!",
          recommendation: "Latih kembali operasi perkalian dan pembagian dasar agar semakin cepat."
        });
      }

      const { players, themeName, totalRounds } = req.body;

      const prompt = `Kamu adalah "Guru Numerasi Numiland", seorang karakter motivator matematika SD yang ceria, penuh semangat, dan menginspirasi dalam bahasa Indonesia.
      Berikut adalah hasil pertandingan game numerasi matematika "Numiland" tema "${themeName}" (${totalRounds} ronde):
      ${JSON.stringify(players, null, 2)}

      Berikan tanggapan singkat (maksimal 3-4 kalimat) yang berisi:
      1. Pujian semangat untuk para siswa dan pemenang.
      2. Catatan positif tentang ketelitian dan kecepatan mereka.
      3. Saran belajar berhitung sederhana yang menyenangkan.
      Jawab dalam format JSON persis: {"summary": "...", "recommendation": "..."}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } else {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error("AI Coach Error:", err);
      return res.json({
        summary: "Pekerjaan yang hebat, anak-anak hebat Numiland! Teruskan semangat belajar matematikanya!",
        recommendation: "Lakukan latihan numerasi rutin 5-10 minute setiap hari."
      });
    }
  });

  // Serve Vite in development mode or dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Numiland Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
