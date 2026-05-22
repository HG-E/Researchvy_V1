import { generatePageMetadata } from "@/lib/seo/metadata";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = generatePageMetadata({
  title: "Reset Password",
  description: "Reset your Researchvy account password.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
