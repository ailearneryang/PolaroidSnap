import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a short, creative caption for a polaroid photo.
 * @param base64Image The image in base64 format (including data URI prefix).
 */
export const generatePhotoCaption = async (base64Image: string): Promise<string> => {
  try {
    // Remove data URL prefix if present for the API call
    const base64Data = base64Image.split(',')[1];
    
    const prompt = "Please look at this image and generate a very short, poetic, or witty caption (maximum 10 words) suitable for a Polaroid photo bottom margin. The language should be Chinese (Simplified). Only return the text.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or we could detect
              data: base64Data
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text?.trim() || "美好瞬间";
  } catch (error) {
    console.error("Gemini Caption Error:", error);
    return "美好瞬间"; // Fallback caption
  }
};
