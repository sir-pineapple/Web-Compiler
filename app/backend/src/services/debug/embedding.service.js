
const { GoogleGenAI } = require("@google/genai");

const MODEL = "gemini-embedding-2";
const DIMENSIONS = 768;

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
}

const client = new GoogleGenAI({ apiKey });

const embedText = async (text) => {
    if (typeof text !== "string" || !text.trim()) {
        throw new TypeError("Embedding input must be a non-empty string");
    }

    try {
        const response = await client.models.embedContent({
            model: MODEL,
            contents: text,
            config: {
                outputDimensionality: DIMENSIONS,
            },
        });

        const values = response.embeddings?.[0]?.values;

        if (
            !Array.isArray(values) ||
            values.length !== DIMENSIONS ||
            !values.every(Number.isFinite)
        ) {
            throw new Error("Gemini returned an invalid embedding vector");
        }

        return values;
    } catch (error) {
        if (error.message === "Gemini returned an invalid embedding vector") {
            throw error;
        }

        const wrappedError = new Error(
            `Gemini embedding request failed: ${error.message}`
        );

        wrappedError.cause = error;
        wrappedError.status = error.status ?? error.statusCode;
        wrappedError.code = error.code;

        throw wrappedError;
    }
};

module.exports = {
    embedText,
    DIMENSIONS,
    MODEL,
};
