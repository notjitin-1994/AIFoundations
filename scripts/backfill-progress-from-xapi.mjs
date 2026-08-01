#!/usr/bin/env node
/**
 * One-time backfill: reconstruct module_progress.completed_slides (+ completed
 * flags) from the xapi_statements event history for learners whose DB rows were
 * left sparse by the pre-fix Server Action outage.
 *
 * Usage:
 *   DATABASE_URL=<postgres conn string> node scripts/backfill-progress-from-xapi.mjs --dry-run
 *   DATABASE_URL=<postgres conn string> node scripts/backfill-progress-from-xapi.mjs --apply
 *
 * Idempotent: only fills rows where completed_slides is NULL/empty (or missing
 * the module key) and only sets completed=true where it is not already set.
 * Never overwrites existing data.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const dryRun = process.argv.includes("--dry-run");

const BACKFILL_SLIDES_SQL = `
WITH slide_events AS (
  SELECT user_id,
    split_part(split_part(object_id, '/activities/', 2), '/slides/', 1) AS module_id,
    split_part(split_part(object_id, '/slides/', 2), '/', 1) AS slide_id
  FROM xapi_statements
  WHERE object_id LIKE '%/activities/%/slides/%'
    AND verb_id = 'http://adlnet.gov/expapi/verbs/experienced'
),
per_user AS (
  SELECT user_id, module_id, jsonb_build_object(module_id, slides) AS slides_map
  FROM (
    SELECT user_id, module_id, jsonb_agg(DISTINCT slide_id) AS slides
    FROM slide_events
    GROUP BY user_id, module_id
  ) t
)
UPDATE module_progress mp
SET completed_slides = COALESCE(mp.completed_slides, '{}'::jsonb) || pum.slides_map
FROM per_user pum
WHERE mp.user_id = pum.user_id
  AND mp.module_id = pum.module_id
  AND (mp.completed_slides IS NULL OR mp.completed_slides = '{}'::jsonb OR NOT mp.completed_slides ? pum.module_id);
`;

const BACKFILL_COMPLETED_SQL = `
WITH completed_events AS (
  SELECT user_id, split_part(object_id, '/activities/modules/', 2) AS module_id
  FROM xapi_statements
  WHERE object_id LIKE '%/activities/modules/%'
    AND verb_id = 'http://adlnet.gov/expapi/verbs/completed'
    AND split_part(object_id, '/activities/modules/', 2) ~ '^[0-6]$'
)
UPDATE module_progress mp
SET completed = true, completed_at = COALESCE(mp.completed_at, now())
FROM completed_events ce
WHERE mp.user_id = ce.user_id
  AND mp.module_id = ce.module_id
  AND NOT COALESCE(mp.completed, false);
`;

const FIX_COMPLETED_AT_SQL = `
UPDATE module_progress
SET completed_at = NULL
WHERE completed = false AND completed_at IS NOT NULL;
`;

function run(sql) {
  const file = `/tmp/opencode/backfill-${Date.now()}.sql`;
  require("node:fs").writeFileSync(file, sql);
  const args = ["-X", "-q", "-v", "ON_ERROR_STOP=1", "-f", file];
  if (dryRun) args.splice(args.length - 1, 0, ...["-c", "BEGIN;"]);
  const res = spawnSync("psql", [...args, process.env.DATABASE_URL], { encoding: "utf8" });
  console.log(res.stdout);
  if (res.status !== 0) {
    console.error(res.stderr);
    process.exit(res.status ?? 1);
  }
}

if (dryRun) {
  console.log("DRY-RUN: wrap the writes in a transaction and roll back.");
  run(`BEGIN;
${BACKFILL_SLIDES_SQL}
${BACKFILL_COMPLETED_SQL}
${FIX_COMPLETED_AT_SQL}
ROLLBACK;`);
} else {
  run(BACKFILL_SLIDES_SQL);
  run(BACKFILL_COMPLETED_SQL);
  run(FIX_COMPLETED_AT_SQL);
}
console.log(dryRun ? "Dry-run completed (no changes persisted)." : "Backfill applied.");
