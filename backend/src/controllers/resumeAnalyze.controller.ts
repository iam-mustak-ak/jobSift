import { RequestHandler } from "express";
import crypto from "node:crypto";
import pdfParse from "pdf-parse";
import { buildPrompt, buildResumeOnlyPrompt } from "../libs/gptAnalyzingPrompt";
import redis from "../libs/redis";
import customError from "../utils/customError";
import safeParseJson from "../utils/safeParseJson";
import validateResult from "../utils/validateResult";

export const analyzeReumeController: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const jd = req.body.jobDescription;
        const requestedMode = req.body.mode;
        const file = req.file;

        if (
            requestedMode &&
            !["job-description", "resume-only"].includes(requestedMode)
        ) {
            return next(customError(400, "Invalid resume analysis mode"));
        }
        const mode = requestedMode || "job-description";

        if (!file) return res.status(400).json({ error: "PDF file required" });
        if (file.mimetype !== "application/pdf") {
            return next(customError(400, "Only PDF files are accepted"));
        }
        if (mode === "job-description" && !String(jd ?? "").trim()) {
            return next(
                customError(
                    400,
                    "Job description is required for job matching analysis",
                ),
            );
        }

        const data = await pdfParse(file.buffer);
        let resumeText = (data.text || "").trim();

        if (!resumeText) {
            return next(
                customError(
                    422,
                    "No text extracted. This PDF may be image-based. Add OCR (e.g., tesseract-ocr) to continue.",
                ),
            );
        }

        resumeText = resumeText
            .replace(/\r/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .slice(0, 180000);

        const cacheKey = `resume_analysis:${crypto
            .createHash("sha256")
            .update(
                `${mode}\0${resumeText}\0${mode === "job-description" ? jd : ""}`,
            )
            .digest("hex")}`;

        const cached = await redis.get(cacheKey).catch(() => null);
        if (cached) {
            return res.status(200).json({
                success: true,
                message: "Analyzing done (from cache)",
                data: JSON.parse(cached),
                mode,
                cached: true,
            });
        }

        const prompt =
            mode === "resume-only"
                ? buildResumeOnlyPrompt(resumeText)
                : buildPrompt(resumeText, String(jd));
        const geminiApiKey =
            process.env.GEMINI_API_KEY ||
            process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!geminiApiKey) {
            return next(
                customError(
                    503,
                    "Resume analysis is not configured. Set GEMINI_API_KEY on the backend.",
                ),
            );
        }

        const aiResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "x-goog-api-key": geminiApiKey,
                },
                body: JSON.stringify({
                    model: "gemini-3.8-flash",
                    input: prompt,
                    // Resumes contain personal information; don't persist the interaction.
                    store: false,
                }),
            },
        );
        const interaction = await aiResponse.json();
        if (!aiResponse.ok) {
            return next(
                customError(
                    aiResponse.status,
                    interaction?.error?.message || "Gemini resume analysis failed",
                ),
            );
        }
        const raw =
            interaction?.output_text ??
            interaction?.steps
                ?.filter((step: any) => step.type === "model_output")
                .flatMap((step: any) => step.content ?? [])
                .filter((part: any) => part.type === "text")
                .map((part: any) => part.text)
                .join("");
        if (typeof raw !== "string" || !raw.trim()) {
            return next(
                customError(
                    502,
                    "Gemini returned an empty resume analysis. Please try again.",
                ),
            );
        }
        const parsed = safeParseJson(raw);
        const validated = validateResult(parsed);

        if (mode === "job-description" && !validated.keywordCoverage) {
            return next(
                customError(
                    502,
                    "The job analysis response was incomplete. Please try again.",
                ),
            );
        }

        await redis
            .set(cacheKey, JSON.stringify(validated), "EX", 86400)
            .catch(() => undefined);

        return res.status(201).json({
            success: true,
            message: "Analyzing done",
            data: validated,
            mode,
            cached: false,
        });
    } catch (err) {
        next(err);
    }
};
