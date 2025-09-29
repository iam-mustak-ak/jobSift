function safeParseJson(str: string) {
    try {
        return JSON.parse(str);
    } catch {
        // Attempt to extract a JSON object from text
        const match = str && str.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Model did not return JSON");
        return JSON.parse(match[0]);
    }
}

export default safeParseJson;
