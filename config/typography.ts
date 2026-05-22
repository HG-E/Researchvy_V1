export const typography = {
  fonts: {
    serif:  '"Lora", "Georgia", serif',
    sans:   '"Inter", system-ui, sans-serif',
    mono:   '"JetBrains Mono", monospace',
  },

  sizes: {
    xs:   "0.75rem",   // 12px — labels, captions
    sm:   "0.875rem",  // 14px — body small, buttons
    base: "1rem",      // 16px — body default
    lg:   "1.125rem",  // 18px — lead paragraph
    xl:   "1.25rem",   // 20px — H4
    "2xl":"1.5rem",    // 24px — H3 small
    "3xl":"1.875rem",  // 30px — H3
    "4xl":"2.25rem",   // 36px — H2 small
    "5xl":"3rem",      // 48px — H2
    "6xl":"3.75rem",   // 60px — H1 medium
    "7xl":"4.5rem",    // 72px — H1 large
  },

  weights: {
    normal:    "400",
    medium:    "500",
    semibold:  "600",
    bold:      "700",
    extrabold: "800",
  },

  lineHeights: {
    none:    "1",
    tight:   "1.2",
    snug:    "1.375",
    normal:  "1.5",
    relaxed: "1.625",
    loose:   "2",
  },

  letterSpacings: {
    tighter: "-0.05em",
    tight:   "-0.025em",
    normal:  "0em",
    wide:    "0.025em",
    wider:   "0.05em",
    widest:  "0.1em",
  },
} as const;
