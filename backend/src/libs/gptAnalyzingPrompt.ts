export const buildPrompt = (resumeText: string, jd: string) => {
    const rubric = `
You are an ATS expert and resume coach. Evaluate the resume against ATS best practices and (if provided) the job description.

Scoring rubric (0-100):
- Parseability & formatting (25): standard headings, readable fonts, minimal tables/columns, consistent bullets, no images for core text.
- Keyword alignment (35): role-critical skills/keywords covered; quantify matches vs. gaps.
- Impact & clarity (25): action verbs, metrics, concise bullets, responsibility vs. achievement balance.
- Structure & style (15): logical section order, contact info, summary value, duplication avoidance.

Return ONLY a compact JSON object with the following exact keys and types:
{
  "atsScore": number (0-100),
  "parseability": { "status": "good"|"ok"|"poor", "reasons": string[] },
  "keywordCoverage": { "matchedKeywords": string[], "missingKeywords": string[], "coveragePct": number (0-100) },
  "missingSkills": string[],
  "issues": [{ "severity": "low"|"medium"|"high", "message": string, "section"?: string }],
  "suggestions": [{ "section": string, "rewriteExample": string, "rationale": string }],
  "sectionQuality": { "summary"?: string, "skills"?: string, "experience"?: string, "education"?: string }
}

Data:
- Resume:
"""${resumeText.slice(0, 180000)}"""
- JobDescription(optional):
"""${(jd || "").slice(0, 60000)}"""
`.trim();
    return rubric;
};
