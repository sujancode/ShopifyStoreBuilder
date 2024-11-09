"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/infrastructure/store/useAuthStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, loading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (!code) {
      setError("Invalid verification link");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(code);
        setVerified(true);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    verify();
  }, [searchParams, verifyEmail]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {error ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/login")}
            >
              Return to Login
            </Button>
          </Alert>
        ) : verified ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Email Verified</AlertTitle>
            <AlertDescription>
              Your email has been successfully verified.
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </Alert>
        ) : null}
      </div>
    </div>
  );
}