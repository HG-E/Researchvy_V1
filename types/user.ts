export type UserRole = "user" | "researcher" | "partner" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  orcid: string | null;
  google_scholar: string | null;
  institutional_affiliation: string | null;
  role: UserRole;
  username: string | null;
  profile_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  clinic_registrations_count?: number;
  certificates_count?: number;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

/** Shape returned by the public /api/users/[username] endpoint — email excluded. */
export interface PublicUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  orcid: string | null;
  google_scholar: string | null;
  institutional_affiliation: string | null;
  role: UserRole;
  username: string;
  created_at: string;
}
