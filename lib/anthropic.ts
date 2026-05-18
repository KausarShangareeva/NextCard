import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic SDK client.
 *
 * Reserved for high-quality LLM tasks where reasoning + code understanding
 * matter — primarily sidebar extraction and lesson generation.
 *
 * Default model: Haiku 4.5 — fastest + cheapest for iteration.
 * Override per environment via ANTHROPIC_MODEL when quality matters more
 * than cost.
 */
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn(
    "[anthropic] ANTHROPIC_API_KEY is missing. Add it to .env.local — " +
      "see https://console.anthropic.com/settings/keys",
  );
}

export const anthropic = new Anthropic({
  apiKey: apiKey ?? "missing-key",
});

export const ANTHROPIC_MODEL =
  process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";

export const isAnthropicConfigured = Boolean(apiKey);
