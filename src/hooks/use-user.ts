"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

import { useProgressStore } from "@/store/progress";
import { useNotesStore } from "@/store/notes";

export type { User };

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const handleUserChange = (newUser: User | null) => {
      setUser(newUser);
      setIsLoading(false);
      
      const progressStore = useProgressStore.getState();
      const notesStore = useNotesStore.getState();
      
      if (newUser) {
        if (progressStore.userId !== newUser.id) {
          progressStore.clearUserStore(newUser.id);
          notesStore.clearUserStore(newUser.id);
        }
      } else {
        if (progressStore.userId !== null) {
          progressStore.clearUserStore(null);
          notesStore.clearUserStore(null);
        }
      }
    };

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      handleUserChange(user);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserChange(session?.user ?? null);
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
