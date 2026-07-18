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
  CLINIC_CHECKOUT_STARTED:  "clinic_checkout_started",
  CLINIC_ORDER_SUBMITTED:   "clinic_order_submitted",

  // Events board
  EVENT_RSVP_COMPLETED:     "event_rsvp_completed",
  EVENT_RSVP_CANCELLED:     "event_rsvp_cancelled",
  EVENT_SAVED:              "event_saved",
  EVENT_UNSAVED:            "event_unsaved",
  EVENT_SUBMITTED:          "event_submitted",

  // Opportunities board
  OPPORTUNITY_SUBMITTED:    "opportunity_submitted",
  OPPORTUNITY_APPLY_CLICKED:"opportunity_apply_clicked",

  // Academy
  COURSE_ENROLLED:          "course_enrolled",
  LESSON_COMPLETED:         "lesson_completed",
  COURSE_COMPLETED:         "course_completed",
  CERTIFICATE_EARNED:       "certificate_earned",

  // Profile
  PROFILE_UPDATED:          "profile_updated",

  // Engagement
  INSIGHT_SHARE_CLICKED:    "insight_share_clicked",

  // CTA tracking (Item 10)
  CTA_CLICKED:              "cta_click",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
