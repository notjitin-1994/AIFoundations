"use server";

import { createClient } from "@/lib/supabase/server";

const COURSE_SLUG = "aifoundations-concept2application";

export async function checkEnrollment(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", COURSE_SLUG)
      .maybeSingle();
    if (!course) return false;

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "active")
      .maybeSingle();

    return !!enrollment;
  } catch (err) {
    console.error("checkEnrollment error:", err);
    return false;
  }
}

export async function markEnrolled(): Promise<{ success: boolean; reason?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, reason: "Not authenticated" };

    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", COURSE_SLUG)
      .maybeSingle();
    if (!course) return { success: false, reason: "Course not found" };

    const { error } = await supabase.from("enrollments").upsert(
      { user_id: user.id, course_id: course.id, status: "active" },
      { onConflict: "user_id,course_id" }
    );

    if (error) {
      console.error("markEnrolled error:", error);
      return { success: false, reason: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("markEnrolled exception:", err);
    return { success: false, reason: "Internal error" };
  }
}
