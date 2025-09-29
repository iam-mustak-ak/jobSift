import OpenAI from "openai";

const openAi = async (prompt: string) => {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const res = await client.chat.completions.create({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
    });
    return res.choices?.[0]?.message?.content || "{}";
};

export default openAi;
