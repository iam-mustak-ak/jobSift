import { RequestHandler } from "express";
import pdfParse from "pdf-parse";
import gemini from "../config/gemini";
import { buildPrompt } from "../libs/gptAnalyzingPrompt";
import customError from "../utils/customError";
import safeParseJson from "../utils/safeParseJson";
import validateResult from "../utils/validateResult";

export const analyzeReumeController: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const jd = req.body?.jd || "";
        const file = req.file;

        if (!file) return res.status(400).json({ error: "PDF file required" });
        if (file.mimetype !== "application/pdf") {
            return next(customError(400, "Only PDF files are accepted"));
        }

        // Extract text from PDF buffer
        const data = await pdfParse(file.buffer);
        let resumeText = (data.text || "").trim();

        if (!resumeText) {
            return next(
                customError(
                    422,
                    "No text extracted. This PDF may be image-based. Add OCR (e.g., tesseract-ocr) to continue."
                )
            );
        }

        // Normalize whitespace
        resumeText = resumeText
            .replace(/\r/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .slice(0, 180000);

        const prompt = buildPrompt(resumeText, jd);

        const raw = await gemini(prompt);

        const parsed = safeParseJson(raw);
        const validated = validateResult(parsed);

        return res.status(201).json({
            success: true,
            message: "Analyzing done",
            data: validated,
        });
    } catch (err) {
        next(err);
    }
};
