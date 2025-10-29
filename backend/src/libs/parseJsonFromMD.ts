export const parseLLMJsonOutput = (output: string) => {
    // Remove ```json at the start and ``` at the end
    const clean = output
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "")
        .trim();

    // Parse JSON safely
    return JSON.parse(clean);
};
