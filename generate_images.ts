import { GoogleGenAI } from "@google/genai";

async function generateImages() {
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

  let prpBase64 = "";
  for (const part of prpResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      prpBase64 = part.inlineData.data;
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

  let exosomeBase64 = "";
  for (const part of exosomeResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      exosomeBase64 = part.inlineData.data;
      break;
    }
  }

  return { prpBase64, exosomeBase64 };
}

generateImages().then(images => {
  console.log("PRP_IMAGE_START");
  console.log(images.prpBase64);
  console.log("PRP_IMAGE_END");
  console.log("EXOSOME_IMAGE_START");
  console.log(images.exosomeBase64);
  console.log("EXOSOME_IMAGE_END");
}).catch(err => {
  console.error(err);
  process.exit(1);
});
