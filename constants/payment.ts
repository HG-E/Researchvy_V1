/**
 * Payment configuration.
 * Replace all PLACEHOLDER values with real credentials before going live.
 * Do NOT commit real credentials — use environment variables or a secrets manager.
 */

export const PAYMENT_CONFIG = {
  bankTransfer: {
    accountName:   process.env.BANK_ACCOUNT_NAME   ?? "ACCOUNT_NAME_PLACEHOLDER",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "ACCOUNT_NUMBER_PLACEHOLDER",
    bankName:      process.env.BANK_NAME           ?? "BANK_NAME_PLACEHOLDER",
    instructions:
      "Transfer the exact amount shown. Use your order reference code as the payment narration. Your enrollment will be confirmed within 2 business hours of a successful transfer.",
  },

  opay: {
    enabled:     false as boolean,
    merchantId:  process.env.OPAY_MERCHANT_ID  ?? "OPAY_MERCHANT_ID_PLACEHOLDER",
    appId:       process.env.OPAY_APP_ID       ?? "OPAY_APP_ID_PLACEHOLDER",
    secretKey:   process.env.OPAY_SECRET_KEY   ?? "OPAY_SECRET_KEY_PLACEHOLDER",
    environment: (process.env.OPAY_ENV ?? "sandbox") as "sandbox" | "production",
    callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchvy.com"}/api/webhooks/opay`,
  },

  earlyBirdDeadline: "2026-06-20",
} as const;
