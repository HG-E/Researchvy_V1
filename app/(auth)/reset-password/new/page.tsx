import { generatePageMetadata } from "@/lib/seo/metadata";
import { NewPasswordForm } from "@/components/auth/NewPasswordForm";

export const metadata = generatePageMetadata({
  title: "Set New Password",
  description: "Set a new password for your Researchvy account.",
  path: "/reset-password/new",
  noIndex: true,
});

export default function NewPasswordPage() {
  return <NewPasswordForm />;
}
