"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { checkEnrollment } from "@/actions/enrollment";

/**
 * Access gate for paid course pages. The DB enrollment (status='active') is the
 * source of truth; unpaid users are sent to the marketing page with the pay link.
 */
export function useEnrollmentGate() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useUser();
  const [status, setStatus] = useState<"loading" | "enrolled" | "blocked">("loading");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setStatus("blocked");
      router.replace("/");
      return;
    }

    let cancelled = false;
    checkEnrollment().then((enrolled) => {
      if (cancelled) return;
      if (enrolled) {
        setStatus("enrolled");
      } else {
        setStatus("blocked");
        router.replace("/");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  return { status, isEnrolled: status === "enrolled", isLoading: status === "loading" };
}
