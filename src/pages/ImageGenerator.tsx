import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

export default function ImageGenerator() {
  const [prpUrl, setPrpUrl] = useState<string | null>(null);
  const [exosomeUrl, setExosomeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImages = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      console.log("Generating PRP image...");
      const prpResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              text: "A high-tech, medical-grade scientific visualization of Platelet-Rich Plasma (PRP). Show a glowing amber and gold liquid in a professional medical glass vial, with microscopic platelets and growth factors represented as glowing particles. The background is a clean, futuristic medical laboratory with teal and cyan accents, cinematic lighting, 8k resolution.",
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of prpResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setPrpUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }

      console.log("Generating Exosomes image...");
      const exosomeResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              text: "A high-tech, medical-grade microscopic visualization of exosomes. Show tiny, glowing spherical vesicles (exosomes) acting as cellular messengers in a deep blue and teal biological environment. The style is futuristic, cinematic lighting, professional medical visualization, 8k resolution, glowing neon accents.",
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of exosomeResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setExosomeUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Failed to generate images:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-12 space-y-12">
      <button 
        onClick={generateImages} 
        disabled={isGenerating}
        className="bg-teal-600 text-white px-8 py-4 rounded-full font-bold"
      >
        {isGenerating ? "Generating..." : "Generate Images"}
      </button>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">PRP Image</h2>
          {prpUrl && <img src={prpUrl} alt="PRP" className="w-full max-w-2xl rounded-3xl shadow-lg" referrerPolicy="no-referrer" />}
          {prpUrl && <textarea className="w-full h-32 mt-4 p-4 border rounded" value={prpUrl} readOnly />}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Exosome Image</h2>
          {exosomeUrl && <img src={exosomeUrl} alt="Exosomes" className="w-full max-w-2xl rounded-3xl shadow-lg" referrerPolicy="no-referrer" />}
          {exosomeUrl && <textarea className="w-full h-32 mt-4 p-4 border rounded" value={exosomeUrl} readOnly />}
        </div>
      </div>
    </div>
  );
}
