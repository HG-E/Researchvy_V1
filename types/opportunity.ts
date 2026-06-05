export type OpportunityCategory =
  | "grant"
  | "fellowship"
  | "conference"
  | "speaking"
  | "collaboration"
  | "job"
  | "award"
  | "travel-grant"
  | "other";

export type OpportunitySubmissionStatus = "pending" | "published" | "rejected";

export interface ResearchOpportunity {
  id: string;
  title: string;
  body: string;
  category: OpportunityCategory;
  funder: string | null;
  value: string | null;
  currency: string;
  deadline: string | null;
  apply_url: string;
  target_level: string;
  is_published: boolean;
  is_featured: boolean;
  auto_fetched: boolean;
  source_url: string | null;
  // Community submission fields (migration 026)
  submitted_by: string | null;
  submission_status: OpportunitySubmissionStatus;
  review_note: string | null;
  linked_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpportunitySubmitPayload {
  title: string;
  body: string;
  category: OpportunityCategory;
  funder?: string;
  value?: string;
  deadline?: string;
  apply_url: string;
  target_level?: string;
}
