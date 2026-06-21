import { z } from "zod";

// ── Authentication ────────────────────────────────────────────────────────────

export const signUpSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string(),
    institutional_affiliation: z
      .string()
      .max(200, "Affiliation is too long")
      .optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const signInSchema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// ── User Profile ──────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  full_name:                 z.string().min(2).max(100),
  bio:                       z.string().max(500).optional(),
  orcid:                     z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, "Invalid ORCID format (e.g. 0000-0001-2345-6789)").optional().or(z.literal("")),
  google_scholar:            z.string().url("Must be a valid URL").optional().or(z.literal("")),
  institutional_affiliation: z.string().max(200).optional(),
});

export const usernameSchema = z
  .string()
  .min(3, "At least 3 characters")
  .max(20, "Max 20 characters")
  .regex(
    /^[a-z0-9][a-z0-9_-]*[a-z0-9]$|^[a-z0-9]{3}$/,
    "Lowercase letters, numbers, hyphens, underscores only"
  );

export const profileWithPublicSchema = profileSchema.extend({
  username:       usernameSchema.optional().or(z.literal("")),
  profile_public: z.boolean().optional(),
});

// ── Clinic Registration ───────────────────────────────────────────────────────

export const clinicRegistrationSchema = z.object({
  clinic_id:           z.string().uuid("Invalid clinic"),
  full_name:           z.string().min(2, "Full name is required").max(100),
  email:               z.string().email("Valid email required"),
  institutional_affiliation: z.string().max(200).optional(),
  accept_terms:        z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to register" }),
  }),
});

// ── Newsletter ────────────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name:  z.string().min(1, "Name is required").max(100).optional(),
});

// ── Contact Form ──────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name:         z.string().min(2, "Name must be at least 2 characters").max(100),
  email:        z.string().email("Please enter a valid email address"),
  organisation: z.string().max(200).optional(),
  subject:      z.string().min(5, "Subject is too short").max(200),
  message:      z.string().min(20, "Message must be at least 20 characters").max(2000),
});

// ── Inferred Types ────────────────────────────────────────────────────────────

export type SignUpInput            = z.infer<typeof signUpSchema>;
export type SignInInput            = z.infer<typeof signInSchema>;
export type ResetPasswordInput     = z.infer<typeof resetPasswordSchema>;
export type NewPasswordInput       = z.infer<typeof newPasswordSchema>;
export type ProfileInput           = z.infer<typeof profileSchema>;
export type ProfileWithPublicInput = z.infer<typeof profileWithPublicSchema>;
export type ClinicRegistrationInput= z.infer<typeof clinicRegistrationSchema>;
export type NewsletterInput        = z.infer<typeof newsletterSchema>;
export type ContactInput           = z.infer<typeof contactSchema>;
