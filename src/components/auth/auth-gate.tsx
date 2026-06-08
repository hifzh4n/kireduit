"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function RootRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) router.replace(user ? "/dashboard" : "/login");
  }, [loading, router, user]);

  return <FullPageLoading />;
}

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, router, user]);

  if (loading || user) return <FullPageLoading />;
  return <>{children}</>;
}

export function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !authRoutes.includes(pathname)) router.replace("/login");
  }, [loading, pathname, router, user]);

  if (loading || !user) return <FullPageLoading />;
  return <>{children}</>;
}

function FullPageLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-4">
      <div className="space-y-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </main>
  );
}
