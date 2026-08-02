# Plan — Payment security (Razorpay verification) + favicon 404

**Owner:** Atlas (direct implementation — no subagents, per user constraint)
**Branch:** `fix/payment-verification-favicon` off `origin/main`

---

## Background / findings (research: Razorpay official docs + community)

**Vulnerability (critical):** `src/actions/enrollment.ts` exports `markEnrolled()` as a
client-callable server action. Any logged-in user can invoke it directly and grant themselves
enrollment with no proof of payment. The marketing page's Razorpay success handler calls it with
zero server-side verification. Also the client falls back to a hardcoded literal key.

**Razorpay-mandated flow** (docs "Standard Checkout" + "Verify Payment Signature"):
1. Create an **Order** server-side (`POST https://api.razorpay.com/v1/orders`, HTTP Basic
   `key_id:key_secret`, amount in paise, immutable, fresh per attempt) — never in the browser.
2. Open `checkout.js` with `order_id`; success handler returns
   `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }`.
3. **Verify on the server**: `expected = HMAC-SHA256(key=KEY_SECRET, msg = order_id + "|" + payment_id).hex()`; compare timing-safe. Mismatch → reject, do NOT fulfill.
4. Only then upsert the enrollment.

**Favicon:** `layout.tsx` metadata `icon: "/logo-swirl.png"` 404s because basePath isn't applied to
metadata icon URLs. Fix: Next file convention — `src/app/icon.png` is served + auto-linked at the
basePath root.

---

## TODOs

- [x] 1. `src/actions/payments.ts` (new): `createCheckoutOrder()` — server-only Orders-API call
  (Basic auth from env, amount 2999900 INR paise, receipt `enroll-<userId>`, notes user_id);
  returns `{ orderId }` or `{ error }` (fail closed if keys missing).
- [x] 2. `src/actions/payments.ts`: `verifyAndEnroll(orderId, paymentId, signature)` — current
  authed user; `crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(orderId+"|"+paymentId)`,
  length-guarded `timingSafeEqual` against the callback signature; on valid → upsert enrollment
  (the old markEnrolled body, idempotent) → `{ success: true }`; on mismatch → log + `{ success: false, reason }` (no enrollment).
- [x] 3. `src/actions/enrollment.ts`: remove the public `markEnrolled` export (it is the
  unverified backdoor; superseded by `verifyAndEnroll`). Keep `checkEnrollment`.
- [x] 4. `src/app/page.tsx`: `handlePayment` becomes async — `createCheckoutOrder()` first;
  pass `order_id` + `key: NEXT_PUBLIC_RAZORPAY_KEY_ID` (remove the literal fallback key);
  success handler calls `verifyAndEnroll(response...)` → enrolled → `/dashboard`. Handle
  order-creation failure with a visible error state (no silent grant).
- [x] 5. Favicon: copy `public/logo-swirl.png` → `src/app/icon.png`; remove the `icons.icon`
  metadata from `src/app/layout.tsx`; delete the now-unreferenced `public/logo-swirl.png`.
- [x] 6. Verify: `npx tsc --noEmit` 0, `npm run lint` zero NEW errors, `npm run build` compiles,
  `npm run test` 51/51.
- [x] 7. Confirm `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`/`NEXT_PUBLIC_RAZORPAY_KEY_ID` exist in
  the Vercel project env; if the secret is missing there, flag it (fail-closed until set).
- [x] 8. Commit (git-master), push, PR, merge, deploy, verify live (marketing page 200, favicon
  resolves under basePath, enrollment gate intact).

## Final Verification Wave

- [x] F1. No client-callable path grants enrollment without a valid Razorpay signature.
- [x] F2. `verifyAndEnroll` rejects tampered signatures (unit-testable logic: HMAC mismatch).
- [x] F3. Favicon loads at `/courses/aifoundations-concept2application/icon.png`; no console 404.
- [x] F4. No regressions: gates, build, tests, live marketing page.

## Acceptance criteria

- Enrollment can only be granted via a verified Razorpay payment signature (or the admin SQL seed).
- No secret material in client code (key_secret server-only; key_id public via env).
- Zero new lint/type/test failures.
