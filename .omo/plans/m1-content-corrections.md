# m1-content-corrections - Work Plan

## TL;DR (For humans)

**What you'll get:** Module 1's content gets five factual corrections — the "stochastic parrot" term gets proper academic attribution, the Machine Learning intro slide stops cutting off its own narration 2 seconds early, the LLM/SLM model examples update from 2023-era names to July 2026 versions, two unused audio files are cleaned up, and the voiceover generation scripts (which contain hardcoded API keys) are scrubbed from the GitHub repository's history entirely.

**Why this approach:** All code edits are independent and go on one feature branch. The git history purge happens separately on main after the code merges, because rewriting history requires a clean working tree and affects every commit SHA. The audio duplication concern turned out to be a false alarm — md5sum confirmed all files are unique despite matching file sizes.

**What it will NOT do:** It will not add the project-spine integration (deferred to later), rotate the API keys (deferred), regenerate any audio files, or fix the YouTube video title label.

**Effort:** Short
**Risk:** Medium - the git history rewrite is destructive (changes all commit SHAs, requires force push)
**Decisions to sanity-check:** The model name choices (GPT-5.6 / Claude Sonnet 5 / Gemini 3.5 Pro for LLMs; Phi-4 / Gemma 4 / Qwen 3 for SLMs) and the choice to defer audio regeneration for the LLM-vs-SLM slide.

Your next move: approve, then run `/start-work`. Full execution detail follows below.

---

> TL;DR (machine): Short effort, Medium risk — 5 code edits + 2 file deletions + git history purge of 3 scripts, all on feature branch then main.

## Scope
### Must have
1. Stochastic parrot attribution in title slide bullet + assessment explanation
2. m1-ml-intro 16-second cutoff removed (audio plays full 17.9s)
3. Model examples updated to July 2026 versions (3 locations in m1/index.tsx)
4. 2 orphaned audio files deleted (m1-timeline.mp3, m1-ml-concepts.mp3)
5. 3 voiceover scripts added to .gitignore, removed from git tracking, purged from git history, force pushed

### Must NOT have (guardrails, anti-slop, scope boundaries)
- NO project spine integration (user deferred)
- NO API key rotation (user deferred)
- NO audio regeneration of any MP3 file
- NO changes to narration audio scripts (narrationText in code may change, but MP3s stay as-is)
- NO changes to the YouTube video title label
- NO changes to duration parameter mismatches in the code
- NO new dependencies, NO new components, NO refactoring beyond the targeted edits
- NO commits directly to main for code changes (use a feature branch per AGENTS.md §11)

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after (lint + build) + manual grep verification for references
- Evidence: .omo/evidence/task-<N>-m1-content-corrections.<ext>

## Execution strategy
### Parallel execution waves

**Wave 1 (parallel — all independent code edits in m1/index.tsx):**
- Task 1: Stochastic parrot attribution (lines 83, 1432)
- Task 2: Remove m1-ml-intro cutoff (line 1486)
- Task 3: Update model examples (lines 1724, 1757, 2738)

**Wave 2 (parallel — file operations):**
- Task 4: Delete orphaned audio files

**Wave 3 (sequential — depends on all above being committed):**
- Task 5: Lint + build verification
- Task 6: Merge feature branch to main
- Task 7: Git history purge of voiceover scripts + force push

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 (attribution) | — | 5 (lint) | 2, 3, 4 |
| 2 (ml-intro fix) | — | 5 (lint) | 1, 3, 4 |
| 3 (model examples) | — | 5 (lint) | 1, 2, 4 |
| 4 (delete orphans) | — | 5 (lint) | 1, 2, 3 |
| 5 (lint + build) | 1, 2, 3, 4 | 6 | — |
| 6 (merge to main) | 5 | 7 | — |
| 7 (history purge) | 6 | — | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. Add stochastic parrot attribution to title slide + assessment explanation
  What to do: Edit `src/components/modules/m1/index.tsx` in two locations:
    - **Line 83**: Change the desc field from `"They stitch language convincingly without actual comprehension."` to `"Coined by Bender, Gebru, et al. (2021). They stitch language convincingly without actual comprehension."`
    - **Line 1432**: Change the explanation from `"A stochastic parrot stitches language together based on probabilistic patterns, creating convincing text without any actual understanding of the meaning."` to `"Coined by Bender, Gebru, et al. (2021) in 'On the Dangers of Stochastic Parrots.' A stochastic parrot stitches language together based on probabilistic patterns, creating convincing text without any actual understanding of the meaning."`
  Must NOT do: Do NOT change the narrationText on line 2726 (would require audio regeneration). Do NOT change the question prompt on line 1429 (the learner is asked to define it — no attribution needed there). Do NOT change the comment on line 45.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: Task 5 (lint)
  References: `src/components/modules/m1/index.tsx:83` (title slide bullet desc), `src/components/modules/m1/index.tsx:1432` (Assessment1 Q6 explanation). Citation: Bender, E. M., Gebru, T., McMillan-Major, A., & Mitchell, M. (2021). "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?" FAccT '21. doi:10.1145/3442188.3445922
  Acceptance criteria: `grep -n "Bender" src/components/modules/m1/index.tsx` returns matches on both line 83 and line 1432.
  QA scenarios: (happy) grep finds "Bender" on 2 lines; (failure) grep finds 0 or 1 matches → edit incomplete. Evidence: .omo/evidence/task-1-m1-content-corrections.txt
  Commit: Y | fix(m1): attribute stochastic parrot term to Bender et al. (2021)

- [x] 2. Remove m1-ml-intro 16-second audio cutoff
  What to do: Edit `src/components/modules/m1/index.tsx` in the `MachineLearningIntroSlide` component (around lines 1480-1500). The `handleTimeUpdate` function on line 1483 contains a hardcoded cutoff at 16 seconds that truncates the narration (actual audio is 17.9s). Remove the entire `handleTimeUpdate` function and its `addEventListener("timeupdate", handleTimeUpdate)` call. The `audio.onended` handler on line 1491 already correctly handles completion — the cutoff is redundant and harmful. The resulting useEffect should look like:
    ```
    useEffect(() => {
      const audio = new Audio("/audio/m1-ml-intro.mp3");
      audioRef.current = audio;
      audio.onended = () => { pause(); if (onComplete) onComplete(); finish(); };
      const timer = setTimeout(() => { play("m1-ml-intro", 16000); audio.play().catch(()=>{}); }, 100);
      return () => {
        clearTimeout(timer);
        audio.pause();
        audioRef.current = null;
      };
    }, [onComplete, play, pause, finish]);
    ```
    Also update the duration parameter from `16000` to `18000` in the `play("m1-ml-intro", 16000)` call to match the actual audio length (17.926s ≈ 18000ms). This keeps the narration store's seek bar accurate.
  Must NOT do: Do NOT change the phase1/phase2 timing logic (phase2 at t>=8 is correct). Do NOT remove the `onended` handler. Do NOT change the audio file path.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: Task 5 (lint)
  References: `src/components/modules/m1/index.tsx:1483-1500` (handleTimeUpdate + useEffect in MachineLearningIntroSlide). Actual audio duration: 17.926s (ffprobe confirmed).
  Acceptance criteria: `grep -n "currentTime >= 16" src/components/modules/m1/index.tsx` returns 0 matches. `grep -n "m1-ml-intro.*18000" src/components/modules/m1/index.tsx` returns 1 match.
  QA scenarios: (happy) grep finds no "currentTime >= 16" cutoff; (failure) grep still finds the cutoff → edit incomplete. Evidence: .omo/evidence/task-2-m1-content-corrections.txt
  Commit: Y | fix(m1): remove ml-intro audio cutoff that truncated narration

- [x] 3. Update LLM/SLM model examples to July 2026 versions
  What to do: Edit `src/components/modules/m1/index.tsx` in three locations:
    - **Line 1724** (LLM tags): Change `{["GPT-4", "Claude 3.5", "Gemini 1.5"]}` to `{["GPT-5.6", "Claude Sonnet 5", "Gemini 3.5 Pro"]}`
    - **Line 1757** (SLM tags): Change `{["Phi-3", "Llama 3 8B", "Gemma"]}` to `{["Phi-4", "Gemma 4", "Qwen 3"]}`
    - **Line 2738** (narrationText): In the m1-llm-vs-slm slide's narrationText, replace `"LLMs, like GPT-4 or Claude"` with `"LLMs, like GPT-5.6 or Claude Sonnet 5"` and replace `"SLMs, like Phi-3 or Llama 3 8B"` with `"SLMs, like Phi-4 or Gemma 4"`.
  Model name rationale (July 2026 web research):
    - LLMs: GPT-5.6 (OpenAI flagship, mainstream rolling out June 2026), Claude Sonnet 5 (Anthropic, GA June 30 2026), Gemini 3.5 Pro (Google flagship, announced I/O May 2026)
    - SLMs: Phi-4 (Microsoft 3.8B, MIT license), Gemma 4 (Google, released April 2 2026), Qwen 3 4B (Alibaba, Apache 2.0). Llama 4 Scout is 109B total / 17B active MoE — no longer an SLM-class model, so replaced with Qwen 3.
  Must NOT do: Do NOT regenerate m1-llm-vs-slm.mp3 audio (deferred). The existing audio will still play with old model names — this is an acceptable temporary mismatch. Do NOT change model names in the knowledge-check questions (those test concepts, not specific versions). Do NOT change the MetricBar values (pct/labels) — those represent conceptual trade-offs, not version-specific data.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: Task 5 (lint)
  References: `src/components/modules/m1/index.tsx:1724` (LLM tag array), `src/components/modules/m1/index.tsx:1757` (SLM tag array), `src/components/modules/m1/index.tsx:2738` (narrationText for m1-llm-vs-slm slide).
  Acceptance criteria: `grep -n "GPT-5.6" src/components/modules/m1/index.tsx` returns ≥2 matches (tag + narration). `grep -n "Phi-4" src/components/modules/m1/index.tsx` returns ≥2 matches. `grep -c "GPT-4\b" src/components/modules/m1/index.tsx` returns 0 (old name fully removed from this file — note: GPT-4 may appear in other files, scope is m1 only).
  QA scenarios: (happy) grep finds new names, old names gone; (failure) old names still present → edit incomplete. Evidence: .omo/evidence/task-3-m1-content-corrections.txt
  Commit: Y | fix(m1): update LLM/SLM model examples to July 2026 versions

- [x] 4. Delete orphaned audio files
  What to do: Delete two unreferenced MP3 files from `public/audio/`:
    - `public/audio/m1-timeline.mp3` (50.76s, 813KB) — replaced by segmented audio (m1-timeline-intro + m1-timeline-0 through m1-timeline-4). Grep for `m1-timeline.mp3` (exact, not prefix-matched) in src/ returned 0 results.
    - `public/audio/m1-ml-concepts.mp3` (49.41s, 792KB) — not referenced anywhere in src/. The ML intro slide uses m1-ml-intro.mp3.
  Must NOT do: Do NOT delete m1-timeline-intro.mp3, m1-timeline-0.mp3, m1-timeline-1.mp3, m1-timeline-2.mp3, m1-timeline-3.mp3, or m1-timeline-4.mp3 — those ARE referenced by the TimelineOfAI component. Do NOT delete m1-ml-intro.mp3 — that IS referenced by MachineLearningIntroSlide.
  Parallelization: Wave 2 | Blocked by: nothing | Blocks: Task 5 (lint)
  References: `public/audio/m1-timeline.mp3`, `public/audio/m1-ml-concepts.mp3`. Grep verification: `grep -r "m1-timeline\.mp3" src/` → 0 matches; `grep -r "m1-ml-concepts" src/` → 0 matches.
  Acceptance criteria: `ls public/audio/m1-timeline.mp3 public/audio/m1-ml-concepts.mp3 2>&1` returns "No such file or directory" for both.
  QA scenarios: (happy) both files gone; (failure) either file still exists → deletion incomplete. Evidence: .omo/evidence/task-4-m1-content-corrections.txt
  Commit: Y | chore(m1): remove orphaned audio files (m1-timeline.mp3, m1-ml-concepts.mp3)

- [x] 5. Lint + build verification
  What to do: After all code edits (tasks 1-3) and file deletions (task 4) are complete, run:
    1. `npm run lint` — must complete with 0 errors
    2. `npm run build` — must complete successfully
    3. `grep -rn "m1-timeline\.mp3\|m1-ml-concepts" src/` — must return 0 matches (no broken references)
    4. `grep -n "GPT-4\b\|Claude 3\.5\|Gemini 1\.5\|Phi-3\|Llama 3 8B" src/components/modules/m1/index.tsx` — must return 0 matches (old model names fully removed)
    5. `grep -n "Bender" src/components/modules/m1/index.tsx` — must return ≥2 matches (attribution present)
    6. `grep -n "currentTime >= 16" src/components/modules/m1/index.tsx` — must return 0 matches (cutoff removed)
  Must NOT do: Do NOT skip any of these checks. If any check fails, fix the issue before proceeding to task 6.
  Parallelization: Wave 3 | Blocked by: Tasks 1, 2, 3, 4 | Blocks: Task 6
  References: All previous tasks.
  Acceptance criteria: All 6 commands above pass (lint 0 errors, build success, greps return expected counts).
  QA scenarios: (happy) all checks pass; (failure) lint/build errors or unexpected grep results → fix and re-run. Evidence: .omo/evidence/task-5-m1-content-corrections.txt (save lint + build output)
  Commit: N (verification only — no code changes)

- [x] 6. Merge feature branch to main
  What to do: After lint + build pass (task 5), merge the feature branch to main:
    1. `git checkout main && git pull origin main`
    2. `git merge --no-ff <feature-branch-name>` (or create a PR and merge via GitHub)
    3. `git push origin main`
  Must NOT do: Do NOT squash-merge if the individual commits need to be preserved. Do NOT rebase the feature branch before merging (keep history clean). Do NOT proceed to task 7 until this merge is on main.
  Parallelization: Wave 3 | Blocked by: Task 5 | Blocks: Task 7
  References: Feature branch from tasks 1-4.
  Acceptance criteria: `git log --oneline -5 main` shows the merge commit and the 4 fix/chore commits.
  QA scenarios: (happy) merge succeeds, push succeeds; (failure) merge conflicts → resolve and retry. Evidence: .omo/evidence/task-6-m1-content-corrections.txt
  Commit: N (merge operation)

- [x] 7. Purge voiceover scripts from git history + force push
  What to do: This is a destructive git history rewrite. Use the `git-master` skill. Steps:
    1. **Add to .gitignore**: Append to `.gitignore`:
       ```
       # voiceover generation scripts (contain API keys — do NOT commit)
       generate-voiceovers.mjs
       generate-voiceovers-m1.mjs
       generate-myth-busting.mjs
       ```
    2. **Stop tracking** (keep local copies): `git rm --cached generate-voiceovers.mjs generate-voiceovers-m1.mjs generate-myth-busting.mjs`
    3. **Commit the removal**: `git add .gitignore && git commit -m "chore: remove voiceover scripts from version control (contain API keys)"`
    4. **Install git-filter-repo** (if not installed): `pip install git-filter-repo` (or `pipx install git-filter-repo`)
    5. **Run the history purge**: `git filter-repo --path generate-voiceovers.mjs --path generate-voiceovers-m1.mjs --path generate-myth-busting.mjs --invert-paths`
    6. **Clean up**: `git reflog expire --expire=now --all && git gc --prune=now --aggressive`
    7. **Re-add origin** (git-filter-repo removes it as a safety measure): `git remote add origin <origin-url>` (run `git remote -v` first to capture the URL before step 5, or check `.git/config`)
    8. **Force push**: `git push --force origin main`
  Must NOT do: Do NOT rotate the API keys (user deferred). Do NOT delete the local copies of the scripts (they're needed for future audio generation). Do NOT skip the force push (without it, the old history remains on GitHub). Do NOT use `git filter-branch` (deprecated, slow, insecure). If git-filter-repo is unavailable, use BFG Repo-Cleaner as fallback: `java -jar bfg.jar --delete-files generate-voiceovers.mjs --delete-files generate-voiceovers-m1.mjs --delete-files generate-myth-busting.mjs`.
  Parallelization: Wave 3 | Blocked by: Task 6 | Blocks: nothing
  References: `generate-voiceovers.mjs` (line 5: API key `sk_c0bb...`), `generate-voiceovers-m1.mjs` (line 5: API key `sk_928...`), `generate-myth-busting.mjs` (line 5: API key `sk_c0bb...`). `.gitignore` at repo root (41 lines, no voiceover entries currently). Skill: `git-master`.
  Acceptance criteria: (1) `git log --all --full-history -- generate-voiceovers-m1.mjs` returns 0 matches. (2) `git log --all --full-history -- generate-voiceovers.mjs` returns 0 matches. (3) `git log --all --full-history -- generate-myth-busting.mjs` returns 0 matches. (4) `grep "generate-voiceovers" .gitignore` returns 3 matches. (5) The 3 script files still exist locally (not deleted from disk, only from git). (6) `git push --force origin main` succeeds.
  QA scenarios: (happy) all 6 acceptance criteria pass; (failure) any history check returns matches → purge incomplete, re-run. Evidence: .omo/evidence/task-7-m1-content-corrections.txt (save all command outputs)
  Commit: Y | chore: purge voiceover scripts from git history (contain hardcoded API keys)

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit — verify all 7 tasks executed, all acceptance criteria met, scope OUT items not violated
- [x] F2. Code quality review — `npm run lint` clean, `npm run build` clean, no `as any` / `@ts-ignore` introduced
- [x] F3. Real manual QA — load Module 1 in dev server, verify: (a) title slide shows "Coined by Bender, Gebru, et al. (2021)" in stochastic parrot bullet, (b) ML intro slide narration plays to completion without cutoff, (c) LLM/SLM slide shows new model names, (d) no broken audio references in console
- [x] F4. Scope fidelity — no project spine integration added, no API keys rotated, no audio regenerated, no YouTube title changed

## Commit strategy
- Feature branch: `fix/m1-content-corrections`
- Atomic commits per task (1-4), then merge to main, then history purge commit on main
- Commit messages: imperative, present tense, ≤72-char head
- Commits:
  1. `fix(m1): attribute stochastic parrot term to Bender et al. (2021)`
  2. `fix(m1): remove ml-intro audio cutoff that truncated narration`
  3. `fix(m1): update LLM/SLM model examples to July 2026 versions`
  4. `chore(m1): remove orphaned audio files (m1-timeline.mp3, m1-ml-concepts.mp3)`
  5. (merge commit) `Merge branch 'fix/m1-content-corrections' into main`
  6. `chore: purge voiceover scripts from git history (contain hardcoded API keys)`

## Success criteria
- All 7 tasks completed with acceptance criteria met
- `npm run lint` and `npm run build` pass with 0 errors
- Module 1 loads in dev server with all corrections visible
- Voiceover scripts are absent from git history (verified via `git log --all --full-history`)
- Voiceover scripts still exist locally (not deleted from disk)
- `.gitignore` contains all 3 script names
- Force push to GitHub successful
