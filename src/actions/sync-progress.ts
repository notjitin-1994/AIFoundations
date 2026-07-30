"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Syncs a learner's module progress to the module_progress table in Supabase.
 * Called on every slide change, lesson completion, and module completion.
 * This is the source of truth for progress across all browsers/sessions.
 */
export async function syncModuleProgress(
  moduleId: string,
  data: {
    completed?: boolean;
    activeLessonIndex?: number;
    activeSlideIndex?: number;
    updated_at?: string;
  }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, reason: "Not authenticated" };

    const payload: Record<string, unknown> = {
      user_id: user.id,
      module_id: moduleId,
      updated_at: data.updated_at || new Date().toISOString(),
    };

    if (data.completed !== undefined) {
      payload.completed = data.completed;
      if (data.completed) payload.completed_at = new Date().toISOString();
    }
    if (data.activeLessonIndex !== undefined) payload.active_lesson_index = data.activeLessonIndex;
    if (data.activeSlideIndex !== undefined) payload.active_slide_index = data.activeSlideIndex;

    const { error } = await supabase.from("module_progress").upsert(payload, {
      onConflict: "user_id,module_id",
    });

    if (error) {
      console.error("syncModuleProgress error:", error);
      return { success: false, reason: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("syncModuleProgress exception:", err);
    return { success: false, reason: "Internal error" };
  }
}

/**
 * Fetches all module progress for the current user from the database.
 * Called on module page mount to restore progress across sessions.
 */
export async function fetchModuleProgress() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.from("module_progress").select("*").eq("user_id", user.id);
    if (error) {
      console.error("fetchModuleProgress error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("fetchModuleProgress exception:", err);
    return null;
  }
}

/**
 * Wipes the learner's module progress from the database.
 * Certificate data is stored in the 'certificates' table and is unaffected.
 */
export async function wipeDatabaseProgress() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, reason: "Not authenticated" };

    const { error } = await supabase
      .from("module_progress")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("wipeDatabaseProgress error:", error);
      return { success: false, reason: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("wipeDatabaseProgress exception:", err);
    return { success: false, reason: "Internal error" };
  }
}
