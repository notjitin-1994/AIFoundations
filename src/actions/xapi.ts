"use server";
import { createClient } from "@/lib/supabase/server";

export async function sendXAPIStatement(
  verbId: string,
  verbDisplay: string,
  objectId: string,
  objectName: string,
  objectDescription?: string,
  context?: { moduleId?: string; slideId?: string; lessonIndex?: number; result?: { score?: number; success?: boolean; completion?: boolean } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, reason: "Not authenticated" };

  // Get user's profile (first_name, last_name, organization_id)
  const { data: profile } = await supabase.from('profiles').select('first_name, last_name, email, organization_id').eq('id', user.id).single();
  const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Learner';

  const statement = {
    actor: { mbox: `mailto:${user.email}`, name: fullName, objectType: "Agent" },
    verb: { id: verbId, display: { "en-US": verbDisplay } },
    object: { id: objectId, definition: { name: { "en-US": objectName }, description: { "en-US": objectDescription || objectName } }, objectType: "Activity" },
    ...(context?.result ? { result: context.result } : {}),
    timestamp: new Date().toISOString(),
  };

  const { error } = await supabase.from('xapi_statements').insert({
    user_id: user.id,
    organization_id: profile?.organization_id ?? null,
    actor_id: user.email!,
    verb_id: verbId,
    verb_display: verbDisplay,
    object_id: objectId,
    object_name: objectName,
    object_description: objectDescription,
    result_score: context?.result?.score ?? null,
    result_success: context?.result?.success ?? null,
    result_completion: context?.result?.completion ?? null,
    context_module_id: context?.moduleId ?? null,
    context_slide_id: context?.slideId ?? null,
    context_lesson_index: context?.lessonIndex ?? null,
    statement: statement,
  });

  if (error) { console.error("xAPI insert error:", error); return { success: false }; }
  return { success: true };
}
