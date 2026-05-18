import OpenAI from "openai";

/**
 * LLM client. Uses the OpenAI SDK pointed at Groq's OpenAI-compatible endpoint.
 * Swap baseURL + apiKey + MODEL to migrate providers without touching call sites.
 */
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn(
    "[llm] GROQ_API_KEY is missing. Add it to .env.local — see https://console.groq.com",
  );
}

export const llm = new OpenAI({
  apiKey: apiKey ?? "missing-key",
  baseURL: "https://api.groq.com/openai/v1",
});

export const MODEL = "llama-3.3-70b-versatile";

export const isLlmConfigured = Boolean(apiKey);
