---
slug: m1-content-corrections
status: awaiting-approval
intent: clear
review_required: true
pending-action: write .omo/plans/m1-content-corrections.md
approach: 5 code/cleanup edits to m1/index.tsx + 2 orphaned audio deletions + git history purge of 3 voiceover scripts. All on one feature branch, then merge to main, then history rewrite on main.
---

# Draft: m1-content-corrections

## Components (topology ledger)
| id | outcome (one line) | status: active|deferred | evidence path |
|---|---|---|---|
| C1 | Stochastic parrot attribution added to title slide + assessment | active | m1/index.tsx:83,1432 |
| C2 | m1-ml-intro 16s cutoff removed, audio plays full 17.9s | active | m1/index.tsx:1486 |
| C3 | Model examples updated to July 2026 versions | active | m1/index.tsx:1724,1757,2738 |
| C4 | Audio duplication investigated — NO duplicates found | active (complete) | md5sum results below |
| C5 | 2 orphaned audio files deleted | active | public/audio/m1-timeline.mp3, m1-ml-concepts.mp3 |
| C6 | 3 voiceover scripts purged from git history + gitignored | active | generate-voiceovers.mjs, generate-voiceovers-m1.mjs, generate-myth-busting.mjs |
| C7 | Project spine integration in M1 | deferred | User: "We will do this later" |

## Open assumptions (announced defaults)
| assumption | adopted default | rationale | reversible? |
|---|---|---|---|
| Model names to use for July 2026 | LLMs: GPT-5.6, Claude Sonnet 5, Gemini 3.5 Pro; SLMs: Phi-4, Gemma 4, Qwen 3 | Web research July 8 2026: GPT-5.6 (OpenAI, mainstream rolling out), Claude Sonnet 5 (Anthropic, GA June 30 2026), Gemini 3.5 Pro (Google, flagship). SLMs: Phi-4 (Microsoft 3.8B), Gemma 4 (Google, released Apr 2 2026), Qwen 3 4B (Alibaba). Llama 4 Scout is 109B total / 17B active MoE — no longer an SLM. | Yes — trivial text edit |
| Attribution format for stochastic parrot | Brief parenthetical in description text: "Coined by Bender, Gebru, et al. (2021)" | Academic integrity; the module itself teaches "AI generates, but you evaluate" — must model citation practice | Yes |
| Git history purge tool | git-filter-repo | Modern recommended tool (Python-based, no Java needed). BFG is alternative if git-filter-repo unavailable. | Yes — can use BFG instead |
| m1-llm-vs-slm.mp3 audio regeneration | Deferred — update narrationText in code now; note audio mismatch; regenerate later after API key rotation | User said "ignore the hardcoded api key for now." Using it to regenerate audio before purging is possible but adds complexity. Narration text change is non-breaking — existing audio still plays. | Yes |
| Branch strategy | Feature branch for code edits → merge to main → history purge on main | AGENTS.md §11: "Branch per task." History purge is a main-branch maintenance op. | Yes |

## Findings (cited - path:lines)

### Stochastic parrot — 5 occurrences in m1/index.tsx
- Line 45: comment (no action)
- Line 83: `{ title: "A Stochastic Parrot", desc: "They stitch language convincingly without actual comprehension.", icon: MessageSquare }` — UI text, needs attribution
- Line 1429: Assessment 1 question prompt (no attribution needed — it's asking the learner to define it)
- Line 1432: `explanation: "A stochastic parrot stitches language together based on probabilistic patterns..."` — needs attribution
- Line 2726: narrationText — changing requires audio regen; deferred

Citation: Bender, E. M., Gebru, T., McMillan-Major, A., & Mitchell, M. (2021). "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?" FAccT '21. doi:10.1145/3442188.3445922

### m1-ml-intro cutoff bug
- Line 1486: `if (audio.currentTime >= 16) { audio.pause(); pause(); if (onComplete) onComplete(); finish(); }`
- Actual audio duration: 17.926s (ffprobe confirmed)
- Fix: Remove the entire `if (audio.currentTime >= 16)` block inside `handleTimeUpdate`. The `audio.onended` handler on line 1491 already handles completion correctly.
- Also remove the `handleTimeUpdate` function and its `addEventListener("timeupdate", handleTimeUpdate)` if no other logic depends on it (checking: it only contains the cutoff — safe to remove entirely).

### Model name references — 3 locations
- Line 1724: `{["GPT-4", "Claude 3.5", "Gemini 1.5"].map((name) => (` — LLM tags
- Line 1757: `{["Phi-3", "Llama 3 8B", "Gemma"].map((name) => (` — SLM tags
- Line 2738: narrationText: "...LLMs, like GPT-4 or Claude... SLMs, like Phi-3 or Llama 3 8B..."

### Audio duplication — NO duplicates (md5sum verified)
```
0c65e1a6d81ee3829217ecd6508919b8  m1-ml-supervised.mp3
5e7e755609e3b04c1a311d6fcbe840fa  m1-prompt-models-json.mp3
78dbee30a2716308a04934e951c53304  m1-quiz.mp3
a4534be0235bd73c6b0dc1f073d93f20  m1-timeline-3.mp3
ac3d5df629e411f4dfca714255f3ba0e  m1-prompt-iteration-v3.mp3
```
All hashes distinct. Same file sizes are encoder artifacts (128kbps CBR, same duration → same padded frame count). **No action needed.**

### Orphaned audio files — confirmed unreferenced
- `public/audio/m1-timeline.mp3` (50.76s, 813KB) — grep for `m1-timeline.mp3` in src/ returned 0 matches. The timeline slide uses segmented audio (m1-timeline-intro + m1-timeline-0 through m1-timeline-4), not this full track.
- `public/audio/m1-ml-concepts.mp3` (49.41s, 792KB) — grep for `m1-ml-concepts` in src/ returned 0 matches. The ML intro slide uses m1-ml-intro.mp3.

### Voiceover scripts — 3 files, all with hardcoded API keys
- `generate-voiceovers.mjs` — key: `sk_c0bb6102...` (Module 0 audio)
- `generate-voiceovers-m1.mjs` — key: `sk_9284ac0e...` (Module 1 ML + prompt-engineering audio)
- `generate-myth-busting.mjs` — key: `sk_c0bb6102...` (same as generate-voiceovers.mjs; myth-busting slide audio)
- All 3 need: git rm --cached → .gitignore → history purge → force push
- User instruction: "purge the audio generation script from github and add the file to gitignore"

### .gitignore — current state
- Exists at `/home/jitin/AIFoundations/.gitignore` (41 lines)
- No voiceover script entries currently
- Has `.env*` already gitignored

## Decisions (with rationale)
1. **Qwen 3 replaces Llama 3 8B in SLM examples** — Llama 4 Scout (109B total / 17B active MoE) is not an SLM. Qwen 3 4B (Apache 2.0, strong multilingual) is a top-tier current SLM. SmolLM3 was considered but Qwen 3 is more established.
2. **Attribution goes in UI text only, not narration** — Changing narration requires audio regeneration. The UI text (title slide bullet + assessment explanation) is the visible surface learners read. Narration audio can be updated later during a batch audio regeneration.
3. **m1-llm-vs-slm.mp3 not regenerated now** — The narration text in code will be updated (so on-screen transcript matches new names), but the existing audio (which says "GPT-4 or Claude") will play until a future audio regeneration pass. This is an acceptable temporary mismatch.
4. **git-filter-repo for history purge** — Preferred over BFG (no Java dependency) and git filter-branch (deprecated, slower). Install via pip if needed.
5. **History purge on main, after feature branch merge** — Code edits go on a feature branch per AGENTS.md §11. History rewrite happens on main after merge, followed by force push.

## Scope IN
- Edit m1/index.tsx: stochastic parrot attribution (2 locations)
- Edit m1/index.tsx: remove m1-ml-intro 16s cutoff
- Edit m1/index.tsx: update model examples (3 locations)
- Delete public/audio/m1-timeline.mp3
- Delete public/audio/m1-ml-concepts.mp3
- Add 3 voiceover scripts to .gitignore
- git rm --cached 3 voiceover scripts
- Purge 3 voiceover scripts from git history
- Force push to origin

## Scope OUT (Must NOT have)
- NO project spine integration (user deferred: "We will do this later")
- NO API key rotation (user deferred: "we will rotate it a little later")
- NO audio regeneration for m1-llm-vs-slm.mp3 (deferred — narration text updated in code only)
- NO narration text change for stochastic parrot (deferred — would require audio regeneration)
- NO changes to the YouTube video title label (separate issue, not requested)
- NO changes to duration parameter mismatches (cosmetic, not requested)
- NO changes to Assessment 1 question prompt (line 1429 — asking the learner to define it, no attribution needed there)

## Open questions
None — all forks resolved through exploration or best-practice defaults.

## Approval gate
status: awaiting-approval
The plan covers 5 code/cleanup edits + 2 file deletions + git history purge. All decisions documented above. User has not yet approved execution.
