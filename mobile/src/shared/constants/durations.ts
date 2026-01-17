export const DURATIONS = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  debounceShort: 150,
  debounceNormal: 300,
  debounceLong: 500,
  apiTimeout: 30000,
  toastShort: 2000,
  toastLong: 4000,
} as const;

export type Durations = typeof DURATIONS;
