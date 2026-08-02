"use server";

import { createClient } from "@/lib/supabase/server";
import { COURSE_SLUG } from "@/lib/course-slug";

export interface CertificateRecord {
  id: string; // The stable UUID identity — minted once, never deleted
  userId: string;
  baselineScore: number;
  finalScore: number;
  moduleScores: { moduleId: string; moduleName: string; score: number }[];
  isVerified: boolean;
  issuedAt: string;
  projectSpine: string;
}

export async function requestVerification(certId: string) {
  // In a real application, this would mark the certificate for instructor review
  // or trigger an LLM-based verification of the final capstone project.
  console.log(`Verification requested for ${certId}`);

  // Simulated delay for realism
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { success: true };
}

/**
 * Fetches or mints the learner's certificate record. The row is created once
 * (stable UUID identity) and survives course restarts — the wipe deletes
 * progress data but never certificates. Re-completion refreshes the payload
 * while the UUID and issued_at stay constant.
 */
export async function getOrCreateCertificateRecord(input: {
  payload: Omit<CertificateRecord, "id" | "issuedAt">;
}): Promise<{ certificate: CertificateRecord | null; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { certificate: null, error: "Not authenticated" };

    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", COURSE_SLUG)
      .maybeSingle();
    if (!course) return { certificate: null, error: "Course not found" };

    const { data: existing } = await supabase
      .from("certificates")
      .select("id, issued_at")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("certificates")
        .update({ payload: input.payload, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) {
        console.error("getOrCreateCertificateRecord update error:", error.message);
        return { certificate: null, error: error.message };
      }
      return { certificate: { id: existing.id, issuedAt: existing.issued_at, ...input.payload } };
    }

    const { data: created, error } = await supabase
      .from("certificates")
      .insert({ user_id: user.id, course_id: course.id, payload: input.payload })
      .select("id, issued_at")
      .single();
    if (error || !created) {
      console.error("getOrCreateCertificateRecord insert error:", error?.message ?? "no row");
      return { certificate: null, error: error?.message ?? "Could not create certificate" };
    }
    return { certificate: { id: created.id, issuedAt: created.issued_at, ...input.payload } };
  } catch (err) {
    console.error("getOrCreateCertificateRecord exception:", err instanceof Error ? err.message : String(err));
    return { certificate: null, error: "Internal error" };
  }
}
