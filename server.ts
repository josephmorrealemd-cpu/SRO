import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route for Hologram Generation
  app.post("/api/generate-hologram", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from environment");
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      console.log("Generating hologram with Gemini API...");
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Try primary image model first
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: "A high-tech, medical-grade holographic render of a FULL HUMAN BODY anatomy in a standing pose, showing the entire skeletal structure and all major joints from head to toe. Futuristic glowing teal and cyan neon lines on a deep slate background, semi-transparent, cinematic lighting, professional medical visualization, 8k resolution, aspect ratio 9:16.",
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: "9:16",
            },
          },
        });

        console.log("Gemini response parts:", response.candidates?.[0]?.content?.parts?.length || 0);

        let imageUrl = "";
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            console.log("Image data extracted successfully (mimeType:", part.inlineData.mimeType, ")");
            break;
          }
        }

        if (imageUrl) {
          return res.json({ imageUrl });
        }
      } catch (innerError: any) {
        console.warn("Primary image model failed, trying fallback:", innerError.message);
      }

      // Fallback to a general multimodal model if the specific image model failed
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: {
          parts: [
            {
              text: "A high-tech, medical-grade holographic render of a FULL HUMAN BODY anatomy in a standing pose, showing the entire skeletal structure and all major joints from head to toe. Futuristic glowing teal and cyan neon lines on a deep slate background, semi-transparent, cinematic lighting, professional medical visualization, 8k resolution. GENERATE AN IMAGE.",
            },
          ],
        },
      });

      let fallbackImageUrl = "";
      for (const part of fallbackResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          fallbackImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          console.log("Fallback image data extracted successfully");
          break;
        }
      }

      if (fallbackImageUrl) {
        return res.json({ imageUrl: fallbackImageUrl });
      }

      // Final fallback to a high-quality static asset
      console.log("All AI generation failed, using static fallback.");
      res.json({ imageUrl: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800" });
    } catch (error: any) {
      console.error("Hologram generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate hologram" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
