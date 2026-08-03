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
    assessments?: any;
    projectSpine?: any;
    projectSpineAnswers?: any;
    gamification?: any;
    completedLessons?: any;
    completedSlides?: any;
    notes?: any;
  }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, reason: "Not authenticated" };

    const payload: Record<string, unknown> = {
      module_id: moduleId,
      updated_at: data.updated_at || new Date().toISOString(),
    };

    if (data.completed !== undefined) payload.completed = data.completed;
    if (data.activeLessonIndex !== undefined) payload.active_lesson_index = data.activeLessonIndex;
    if (data.activeSlideIndex !== undefined) payload.active_slide_index = data.activeSlideIndex;
    if (data.assessments !== undefined) payload.assessments = data.assessments;
    if (data.projectSpine !== undefined) payload.project_spine = data.projectSpine;
    if (data.projectSpineAnswers !== undefined) payload.project_spine_answers = data.projectSpineAnswers;
    if (data.gamification !== undefined) payload.gamification = data.gamification;
    if (data.completedLessons !== undefined) payload.completed_lessons = data.completedLessons;
    if (data.completedSlides !== undefined) payload.completed_slides = data.completedSlides;
    if (data.notes !== undefined) payload.notes = data.notes;

    // Server-authoritative merge write path (public.merge_module_progress):
    // the RPC atomically MERGES this payload into the row — partial payloads
    // union arrays and never clobber existing data.
    const { data: row, error } = await supabase.rpc("merge_module_progress", { payload });

    if (error) {
      console.error("syncModuleProgress error:", error);
      return { success: false, reason: error.message };
    }
    return { success: true, row: Array.isArray(row) ? row[0] ?? null : (row ?? null) };
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
    // Next.js Server Actions require strictly serializable plain objects.
    // Supabase responses sometimes contain prototypes that cause 'Server Components render' errors.
    return data ? JSON.parse(JSON.stringify(data)) : null;
  } catch (err) {
    console.error("fetchModuleProgress exception:", err);
    return null;
  }
}

/**
 * Wipes the learner's module progress, events, and certificate from the database.
 */
export async function wipeDatabaseProgress() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, reason: "Not authenticated" };

    const [{ error }, { error: eventsError }, { error: certsError }] = await Promise.all([
      supabase.from("module_progress").delete().eq("user_id", user.id),
      supabase.from("progress_events").delete().eq("user_id", user.id),
      supabase.from("certificates").delete().eq("user_id", user.id),
    ]);

    if (error || eventsError || certsError) {
      console.error("wipeDatabaseProgress error:", error?.message ?? eventsError?.message ?? certsError?.message);
      return { success: false, reason: error?.message ?? eventsError?.message ?? certsError?.message ?? "Could not wipe progress" };
    }
    return { success: true };
  } catch (err) {
    console.error("wipeDatabaseProgress exception:", err);
    return { success: false, reason: "Internal error" };
  }
}

/**
 * Event Sourcing: Logs discrete progress events to the progress_events table.
 * This guarantees progress can never go backwards and provides an audit trail.
 */
export async function logProgressEvent(
  moduleId: string,
  eventType: 'slide_completed' | 'lesson_completed' | 'module_completed' | 'assessment_submitted' | 'project_spine_selected' | 'gamification_xp_earned' | 'gamification_time_spent' | 'gamification_streak_updated' | 'badge_earned',
  eventData: any
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, reason: "Not authenticated" };

    const { error } = await supabase.from("progress_events").insert({
      user_id: user.id,
      module_id: moduleId,
      event_type: eventType,
      event_data: eventData
    });

    if (error) {
      console.error("logProgressEvent error:", error);
      return { success: false, reason: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("logProgressEvent exception:", err);
    return { success: false, reason: "Internal error" };
  }
}
