"use server";

import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@/lib/supabase/server";

const COURSE_SLUG = "aifoundations-concept2application";
const COURSE_AMOUNT_PAISE = 2999900; // INR 29,999

function razorpayAuth(): { keyId: string; keySecret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

/**
 * Creates a server-side Razorpay Order (amount locked at creation, immutable).
 * The key secret never leaves the server; the browser only ever receives the
 * order_id to pass into checkout.js.
 */
export async function createCheckoutOrder(): Promise<{ orderId?: string; error?: string }> {
  const auth = razorpayAuth();
  if (!auth) return { error: "Payment provider not configured" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${auth.keyId}:${auth.keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: COURSE_AMOUNT_PAISE,
        currency: "INR",
        receipt: `enroll-${user.id.slice(0, 24)}`,
        notes: { user_id: user.id },
      }),
    });
    if (!res.ok) {
      console.error("createCheckoutOrder error:", res.status, await res.text().catch(() => ""));
      return { error: "Could not create checkout order" };
    }
    const data = (await res.json()) as { id: string };
    return { orderId: data.id };
  } catch (err) {
    console.error("createCheckoutOrder exception:", err instanceof Error ? err.message : String(err));
    return { error: "Could not create checkout order" };
  }
}

/**
 * Verifies the Razorpay payment signature before granting enrollment.
 * HMAC-SHA256(order_id + "|" + payment_id) keyed with the API key secret is the
 * only proof a payment is authentic; a mismatch rejects and enrolls nobody.
 */
export async function verifyAndEnroll(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<{ success: boolean; reason?: string }> {
  const auth = razorpayAuth();
  if (!auth) return { success: false, reason: "Payment provider not configured" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, reason: "Not authenticated" };

  const expected = createHmac("sha256", auth.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const received = Buffer.from(signature ?? "", "hex");

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    console.error("verifyAndEnroll: signature mismatch", { orderId, userId: user.id });
    return { success: false, reason: "Payment verification failed" };
  }

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
    console.error("verifyAndEnroll upsert error:", error.message);
    return { success: false, reason: error.message };
  }
  return { success: true };
}
