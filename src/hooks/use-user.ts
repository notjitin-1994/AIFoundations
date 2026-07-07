"use client";

import { useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
};

// This is a mock hook that will be replaced with a real auth provider (e.g., Clerk or NextAuth) later.
// Currently, it generates a unique guest session ID in localStorage so the course functions without auth.
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      let sessionId = localStorage.getItem("dummy_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("dummy_session_id", sessionId);
      }
      
      setUser({
        id: sessionId,
        name: "Guest Learner",
        email: `guest-${sessionId.substring(0, 8)}@local.learner`,
      });
    } catch (e) {
      // Fallback for environments where localStorage isn't available
      setUser({
        id: "fallback-id",
        name: "Guest Learner",
        email: "guest@local.learner",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading };
}
