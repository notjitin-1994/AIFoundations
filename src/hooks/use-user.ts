"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type { User };

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { user, isLoading };
}

export function getDisplayName(user: User | null): string {
  if (!user) return 'Learner';
  const firstName = user.user_metadata?.first_name as string | undefined;
  const lastName = user.user_metadata?.last_name as string | undefined;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  return user.email ?? 'Learner';
}
