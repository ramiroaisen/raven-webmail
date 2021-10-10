const bool = (v: string | undefined): boolean => {
  return v === "1" || v?.toLowerCase() === "true";
}

export const DISPLAY_ERRORS = bool(process.env.RAVEN_DISPLAY_ERRORS);
export const SVELTEKIT_DEV  = bool(process.env.RAVEN_SVELTEKIT_DEV);
export const SVELTEKIT_PORT  = Number(process.env.RAVEN_SVELTEKIT_PORT) || 3000;
