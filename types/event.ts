export type EventType =
  | "conference"
  | "seminar"
  | "workshop"
  | "symposium"
  | "webinar"
  | "lecture"
  | "panel"
  | "hackathon"
  | "other";

export type EventFormat = "in-person" | "virtual" | "hybrid";

export type EventStatus =
  | "pending"
  | "approved"
  | "published"
  | "featured"
  | "rejected"
  | "cancelled"
  | "archived";

export type EventRegistrationType = "external" | "internal" | "none";

export type OrganizerType = "external" | "partner" | "researchvy";

export type EventTargetAudience = "early_career" | "mid" | "senior" | "all";

export type EventRegistrationStatus =
  | "registered"
  | "waitlisted"
  | "cancelled"
  | "attended";

export interface AcademicEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  event_type: EventType;
  format: EventFormat;
  location: string | null;
  venue: string | null;
  timezone: string;
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  featured_image: string | null;
  website_url: string | null;
  registration_url: string | null;
  registration_type: EventRegistrationType;
  capacity: number | null;
  is_free: boolean;
  fee_amount: number | null;
  fee_currency: string;
  call_for_papers_url: string | null;
  call_for_papers_deadline: string | null;
  organizer_name: string;
  organizer_email: string | null;
  organizer_type: OrganizerType;
  target_audience: EventTargetAudience;
  disciplines: string[];
  tags: string[];
  status: EventStatus;
  is_featured: boolean;
  submitted_by: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  views_count: number;
  // Funding / competitive admission (migration 027)
  has_travel_funding: boolean;
  funding_description: string | null;
  funding_url: string | null;
  is_competitive_admission: boolean;
  application_url: string | null;
  linked_opportunity_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  status: EventRegistrationStatus;
  registered_at: string;
  notes: string | null;
  event?: AcademicEvent;
}

export interface EventSave {
  event_id: string;
  user_id: string;
  saved_at: string;
  event?: AcademicEvent;
}

export interface EventWithMeta extends AcademicEvent {
  registration_count?: number;
  is_saved?: boolean;
  user_registration?: EventRegistration | null;
}

export interface EventFilters {
  type?: EventType | "";
  format?: EventFormat | "";
  audience?: EventTargetAudience | "";
  upcoming?: boolean;
  search?: string;
}

export interface EventSubmitPayload {
  title: string;
  description: string;
  short_description?: string;
  event_type: EventType;
  format: EventFormat;
  location?: string;
  venue?: string;
  timezone?: string;
  start_date: string;
  end_date?: string;
  registration_deadline?: string;
  featured_image?: string;
  website_url?: string;
  registration_url?: string;
  registration_type?: EventRegistrationType;
  capacity?: number;
  is_free?: boolean;
  fee_amount?: number;
  fee_currency?: string;
  call_for_papers_url?: string;
  call_for_papers_deadline?: string;
  organizer_name: string;
  organizer_email?: string;
  target_audience?: EventTargetAudience;
  disciplines?: string[];
  tags?: string[];
  // Funding / competitive admission
  has_travel_funding?: boolean;
  funding_description?: string;
  funding_url?: string;
  is_competitive_admission?: boolean;
  application_url?: string;
}
