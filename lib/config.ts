/**
 * Single source of truth for default Gemini model IDs.
 * Check Google's current model list and availability before modifying defaults.
 */
export const DEFAULT_GEMINI_MODELS = {
  primary: 'gemini-3.5-flash-lite',
  fallback: 'gemini-3.1-flash-lite',
} as const;
