import { Suspense } from "react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata = generatePageMetadata({
  title: "Create Account",
  description: "Join the Researchvy scholarly visibility ecosystem.",
  path: "/signup",
  noIndex: true,
});

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
