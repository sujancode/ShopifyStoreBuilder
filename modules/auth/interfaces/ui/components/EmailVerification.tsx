"use client";

import { useAuthStore } from "../../../infrastructure/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLoadingState } from "@/hooks/use-loading-state";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export function EmailVerification() {
  const { user, sendVerificationEmail } = useAuthStore();
  const { isLoading, withLoading } = useLoadingState();
  const { toast } = useToast();

  if (!user || user.emailVerified) return null;

  const handleSendVerification = async () => {
    await withLoading(async () => {
      try {
        await sendVerificationEmail();
        toast({
          title: "Success",
          description: "Verification email sent! Please check your inbox.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (err as Error).message,
        });
        throw err;
      }
    });
  };

  return (
    <Alert className="mt-4">
      <Mail className="h-4 w-4" />
      <AlertDescription>
        <div className="flex flex-col space-y-2">
          <p>Please verify your email address to access all features.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendVerification}
            disabled={isLoading}
          >
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            Send Verification Email
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}