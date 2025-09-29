import { GoogleGenAI } from "@google/genai";

async function gemini(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    // Basic call; Gemini doesn't enforce JSON mode, so post-parse carefully.
    const res = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    // The JS SDK exposes response.text for plain text parts.
    return res.text || "{}";
}

export default gemini;
