export type ClinicStatus = "draft" | "published" | "archived";
export type RegistrationStatus = "registered" | "attended" | "completed";

export interface Clinic {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  featured_image: string | null;
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
  price: number;
  status: ClinicStatus;
  created_at: string;
  updated_at: string;
}

export interface ClinicRegistration {
  id: string;
  clinic_id: string;
  user_id: string;
  status: RegistrationStatus;
  certificate_url: string | null;
  registered_at: string;
  attended_at: string | null;
  completed_at: string | null;
  clinic?: Clinic;
}

export interface Certificate {
  id: string;
  user_id: string;
  clinic_id: string;
  certificate_number: string;
  issued_date: string;
  verification_code: string;
  created_at: string;
  clinic?: Clinic;
}

export interface ClinicWithRegistration extends Clinic {
  registration?: ClinicRegistration;
  registrations_count?: number;
}
