export type LessonType = "video" | "article" | "quiz" | "assignment";
export type VideoProvider = "youtube" | "bunny" | "external";
export type EnrollmentTier = "starter" | "builder" | "pro" | "institutional" | "complimentary";
export type EnrollmentSource = "manual" | "payment" | "clinic_alumni" | "admin";

export interface Course {
  id:               string;
  slug:             string;
  title:            string;
  subtitle:         string | null;
  description:      string | null;
  level:            1 | 2 | 3 | 4 | 5;
  position:         number;
  thumbnail_url:    string | null;
  trailer_url:      string | null;
  duration_minutes: number;
  is_published:     boolean;
  is_free:          boolean;
  created_at:       string;
  updated_at:       string;
}

export interface CourseModule {
  id:          string;
  course_id:   string;
  title:       string;
  description: string | null;
  position:    number;
  created_at:  string;
}

export interface Lesson {
  id:                  string;
  module_id:           string;
  title:               string;
  slug:                string;
  lesson_type:         LessonType;
  video_id:            string | null;
  video_provider:      VideoProvider | null;
  video_url:           string | null;
  content_md:          string | null;
  duration_seconds:    number;
  position:            number;
  is_free_preview:     boolean;
  is_published:        boolean;
  created_at:          string;
  updated_at:          string;
}

export interface Enrollment {
  id:           string;
  user_id:      string;
  course_id:    string;
  tier:         EnrollmentTier;
  enrolled_at:  string;
  expires_at:   string | null;
  completed_at: string | null;
  source:       EnrollmentSource;
}

export interface LessonProgress {
  id:                   string;
  user_id:              string;
  lesson_id:            string;
  last_watched_seconds: number;
  watch_percent:        number;
  completed_at:         string | null;
  started_at:           string;
  updated_at:           string;
}

// ── Composed types ────────────────────────────────────────────────────────────

export interface LessonListItem {
  id:              string;
  title:           string;
  slug:            string;
  lesson_type:     LessonType;
  duration_seconds:number;
  position:        number;
  is_free_preview: boolean;
  is_published:    boolean;
}

export interface ModuleWithLessons extends CourseModule {
  lessons: LessonListItem[];
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

// Progress keyed by lesson ID for O(1) lookup on the player page
export type ProgressMap = Record<string, Pick<LessonProgress, "watch_percent" | "completed_at" | "last_watched_seconds">>;

export interface CourseStats {
  total_lessons:     number;
  completed_lessons: number;
  percent_complete:  number;
}
