export const EVENTS = {
  // Acquisition
  SIGN_UP_COMPLETED:        "sign_up_completed",
  SIGN_IN_COMPLETED:        "sign_in_completed",
  NEWSLETTER_SUBSCRIBED:    "newsletter_subscribed",

  // Conversion
  WHATSAPP_CTA_CLICKED:     "whatsapp_cta_clicked",
  CLINIC_CTA_CLICKED:       "clinic_cta_clicked",
  CLINIC_ENQUIRY_SUBMITTED: "clinic_enquiry_submitted",
  ACADEMY_ENQUIRY_SUBMITTED:"academy_enquiry_submitted",

  // Engagement
  INSIGHT_SHARE_CLICKED:    "insight_share_clicked",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
