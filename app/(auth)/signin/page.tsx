import { Suspense } from "react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata = generatePageMetadata({
  title: "Sign In",
  description: "Sign in to your Researchvy account.",
  path: "/signin",
  noIndex: true,
});

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
