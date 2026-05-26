export type { User, UserProfile, UserRole, AuthSession } from "./user";
export type {
  Course, CourseModule, Lesson, LessonType, VideoProvider,
  Enrollment, EnrollmentTier, EnrollmentSource, LessonProgress,
  LessonListItem, ModuleWithLessons, CourseWithModules, ProgressMap, CourseStats,
} from "./academy";
export type {
  Clinic, ClinicRegistration, Certificate, ClinicWithRegistration,
  ClinicStatus, RegistrationStatus,
} from "./clinic";
export type {
  Insight, InsightAuthor, InsightListItem, InsightCategory,
} from "./insight";
export type {
  Resource, ResourceListItem, ResourceCategory, ResourceFileType,
} from "./resource";

// ── Shared utility types ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
}
