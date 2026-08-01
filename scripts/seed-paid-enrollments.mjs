#!/usr/bin/env node
/**
 * Seed / repair "paid" enrollment rows (status='active') for the AI Foundations
 * course. Anyone without an active enrollment is blocked from the course pages
 * and dashboard by the paywall gate.
 *
 * Usage:
 *   DATABASE_URL=<postgres conn string> node scripts/seed-paid-enrollments.mjs
 *
 * Idempotent: upserts on (user_id, course_id); safe to re-run.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const COURSE_ID = "e11a85c2-8738-4891-9f1c-57628b4d6edc";

const TEST_ACCOUNTS = [
  "4b6e4757-3d61-43a5-944f-86a037296994", // jitin@glitchzerolabs.com
  "b2ebb7b7-15a5-49ff-a510-dc97dc271f80", // not.jitin@gmail.com
  "b6f2b52a-e4f5-4a3c-9ee6-02196593819a", // bharat.nair.mail@gmail.com
  "982484fa-644f-436f-b0d5-fc0456402522", // k.bharad@gmail.com
];

const values = TEST_ACCOUNTS.map((uid) => `('${uid}', '${COURSE_ID}', 'active')`).join(",\n");

const sql = `
INSERT INTO enrollments (user_id, course_id, status)
VALUES
${values}
ON CONFLICT (user_id, course_id) DO UPDATE SET status = 'active';
`;

const file = `/tmp/opencode/seed-enrollments-${Date.now()}.sql`;
writeFileSync(file, sql);
const res = spawnSync(
  "psql",
  ["-X", "-q", "-v", "ON_ERROR_STOP=1", "-f", file, process.env.DATABASE_URL],
  { encoding: "utf8" }
);
console.log(res.stdout);
if (res.status !== 0) {
  console.error(res.stderr);
  process.exit(res.status ?? 1);
}
console.log("Enrollment seed applied.");
