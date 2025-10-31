import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { RequestHandler } from "express";
import crypto from "node:crypto";
import pdfParse from "pdf-parse";
import { buildPrompt } from "../libs/gptAnalyzingPrompt";
import redis from "../libs/redis";
import customError from "../utils/customError";
import safeParseJson from "../utils/safeParseJson";
import validateResult from "../utils/validateResult";

export const analyzeReumeController: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const jd = req.body.jobDescription;
        const file = req.file;

        if (!file) return res.status(400).json({ error: "PDF file required" });
        if (file.mimetype !== "application/pdf") {
            return next(customError(400, "Only PDF files are accepted"));
        }
        if (!jd) return next(customError(400, "Job Description is required"));

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

        resumeText = resumeText
            .replace(/\r/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .slice(0, 180000);

        const cacheKey = `resume_analysis:${crypto
            .createHash("sha256")
            .update(resumeText + jd)
            .digest("hex")}`;

        const cached = await redis.get(cacheKey);
        if (cached) {
            return res.status(200).json({
                success: true,
                message: "Analyzing done (from cache)",
                data: JSON.parse(cached),
                cached: true,
            });
        }

        const prompt = buildPrompt(resumeText, jd);

        const { text: raw } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt,
        });

        const parsed = safeParseJson(raw);
        const validated = validateResult(parsed);

        await redis.set(cacheKey, JSON.stringify(validated), "EX", 86400);

        return res.status(201).json({
            success: true,
            message: "Analyzing done",
            data: validated,
            cached: false,
        });
    } catch (err) {
        next(err);
    }
};
