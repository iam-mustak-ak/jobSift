interface ValidateResultInput {
    atsScore: number;
    parseability: {
        status: string;
        reasons?: any[];
    };
    keywordCoverage: {
        coveragePct: number;
        matchedKeywords?: any[];
        missingKeywords?: any[];
    };
    missingSkills?: any[];
    issues?: any[];
    suggestions?: any[];
    sectionQuality?: object | null;
}

function validateResult(obj: ValidateResultInput) {
    if (typeof obj !== "object" || obj === null)
        throw new Error("Invalid JSON shape");
    if (typeof obj.atsScore !== "number")
        throw new Error("atsScore missing/invalid");
    if (!obj.parseability || typeof obj.parseability.status !== "string")
        throw new Error("parseability invalid");
    if (
        !obj.keywordCoverage ||
        typeof obj.keywordCoverage.coveragePct !== "number"
    )
        throw new Error("keywordCoverage invalid");
    if (!Array.isArray(obj.missingSkills)) obj.missingSkills = [];
    if (!Array.isArray(obj.issues)) obj.issues = [];
    if (!Array.isArray(obj.suggestions)) obj.suggestions = [];
    if (typeof obj.sectionQuality !== "object" || obj.sectionQuality === null)
        obj.sectionQuality = {};
    // Clamp numeric fields
    obj.atsScore = Math.max(0, Math.min(100, obj.atsScore));
    obj.keywordCoverage.coveragePct = Math.max(
        0,
        Math.min(100, obj.keywordCoverage.coveragePct)
    );
    // Normalize parseability.status
    const okVals = ["good", "ok", "poor"];
    if (!okVals.includes(obj.parseability.status))
        obj.parseability.status = "ok";
    // Ensure arrays are strings
    obj.parseability.reasons = Array.isArray(obj.parseability.reasons)
        ? obj.parseability.reasons.map(String)
        : [];
    obj.keywordCoverage.matchedKeywords = Array.isArray(
        obj.keywordCoverage.matchedKeywords
    )
        ? obj.keywordCoverage.matchedKeywords.map(String)
        : [];
    obj.keywordCoverage.missingKeywords = Array.isArray(
        obj.keywordCoverage.missingKeywords
    )
        ? obj.keywordCoverage.missingKeywords.map(String)
        : [];
    obj.missingSkills = obj.missingSkills.map(String);
    obj.issues = obj.issues.map((i) => ({
        severity: ["low", "medium", "high"].includes(i?.severity)
            ? i.severity
            : "medium",
        message: String(i?.message || ""),
        section: i?.section ? String(i.section) : undefined,
    }));
    obj.suggestions = obj.suggestions.map((s) => ({
        section: String(s?.section || ""),
        rewriteExample: String(s?.rewriteExample || ""),
        rationale: String(s?.rationale || ""),
    }));
    return obj;
}

export default validateResult;
