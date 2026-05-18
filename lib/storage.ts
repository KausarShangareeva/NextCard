/**
 * Keys used for transient client-side storage (sessionStorage).
 * Centralized so the same string isn't duplicated across pages.
 */
export const STORAGE_KEYS = {
  parseResult: "nextcard:parse-result",
  selectedTopicIds: "nextcard:selected-topic-ids",
} as const;
