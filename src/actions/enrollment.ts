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
