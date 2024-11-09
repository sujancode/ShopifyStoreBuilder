"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/modules/auth/interfaces/ui/components/AuthForm";
import { useAuthStore } from "@/modules/auth/infrastructure/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AuthForm mode="login" onSuccess={() => router.push("/dashboard")} />
      <p className="mt-4 text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}