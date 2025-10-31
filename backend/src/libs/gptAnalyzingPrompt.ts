export const buildPrompt = (resumeText: string, jd: string) => {
    const rubric = `
You are an ATS (Applicant Tracking System) expert and professional resume evaluator. Your task is to thoroughly analyze how well the given resume aligns with the provided job description.

Important:
- The job description (JD) is **mandatory**.
- All analysis and scoring should be based primarily on the JD.
- Evaluate the resume’s content, formatting, and keyword alignment specifically in the context of the provided JD.

Scoring Rubric (0-100):
- **Keyword & Skill Alignment (40):** Identify role-critical keywords, technologies, and skills mentioned in the JD. Measure how well the resume matches these keywords. Quantify both matched and missing skills.
- **Experience & Role Fit (30):** Assess whether the candidate’s experience, achievements, and responsibilities are relevant to the JD’s requirements.
- **Impact & Clarity (15):** Evaluate the effectiveness of action verbs, metrics, and concise bullet points in communicating achievements aligned to the JD.
- **ATS Parseability & Structure (15):** Ensure the resume follows ATS best practices (clear section headers, minimal tables/columns, consistent bullets, no images for core text).

Return ONLY a compact JSON object with the following exact keys and types:
{
  "atsScore": number (0-100),
  "keywordCoverage": { "matchedKeywords": string[], "missingKeywords": string[], "coveragePct": number (0-100) },
  "missingSkills": string[],
  "experienceFit": { "relevantRoles": string[], "gaps": string[], "fitSummary": string },
  "parseability": { "status": "good"|"ok"|"poor", "reasons": string[] },
  "issues": [{ "severity": "low"|"medium"|"high", "message": string, "section"?: string }],
  "suggestions": [{ "section": string, "rewriteExample": string, "rationale": string }],
  "sectionQuality": { "summary"?: string, "skills"?: string, "experience"?: string, "education"?: string }
}

Data:
- Resume:
"""${resumeText}"""
- Job Description:
"""${jd}"""
`.trim();
    return rubric;
};
