# COMPREHENSIVE COURSE OUTLINE & PRODUCTION PLAN

# AI Foundations: Concept to Application

**Course Design Technical Documentation**

Version 1.0 | Working Draft

Target: Non-Technical Adult Learners

Delivery: Custom Web Application (xAPI Integration)

---

Confidential — Working Draft

July 2026

---

## Build Status (rolling)

This document is the **design blueprint**. The section "Built Implementation" inside each module spec records what is *actually shipped in code* as of the last build session, so designers and developers can see planned-vs-built at a glance.

| Module | Spec | Built Implementation |
|---|---|---|
| 0 — Orientation | §4.1 | ✅ **Fully built** — 9-slide deck shipping in `src/app/page.tsx`. See §4.1 "Built Implementation". |
| 1 — The Intelligence Illusion | §4.2 | ✅ **Built through the ML – Deep Learning – AI sections and the prompt/hallucination/bias closing arc** — 17-slide deck in `src/components/modules/m1/index.tsx`. See §4.2 "Built Implementation". |
| 2 — The Goldfish Problem | §4.3 | ⏳ Not started — dynamic route falls through to a stub placeholder. |
| 3 — The Toolbelt | §4.4 | ⏳ Not started. |
| 4 — The Engine Room | §4.5 | ⏳ Not started. |
| 5 — The Assembly Line | §4.6 | ⏳ Not started. |
| 6 — The Local Sandbox | §4.7 | ⏳ Not started. |
| 7 — The Horizon | §4.8 | ⏳ Not started. |

Project templates shipped: 3 of 5 (Research Companion, Content Engine, Creative Studio). Per §8.1.

The reusable `AssessmentRunner` component is in `src/components/lesson/assessment-runner.tsx`, fed by the question bank at `src/lib/question-bank.ts` (extended via `question-bank-extended-1.ts`). It supports four question types (multiple-choice, multiple-select, fill-blank, match-pairs), animated glass feedback overlays, per-module score breakdown, and xAPI statements for `attempted / answered / completed`.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Research Foundation & Theoretical Basis](#2-research-foundation--theoretical-basis)
3. [Course Architecture](#3-course-architecture)
4. [Detailed Module Specifications](#4-detailed-module-specifications)
5. [Tool Landscape Integration Strategy](#5-tool-landscape-integration-strategy)
6. [Assessment Strategy & Capstone Design](#6-assessment-strategy--capstone-design)
7. [Custom Web Architecture & xAPI Implementation Plan](#7-custom-web-architecture--xapi-implementation-plan)
8. [Production Roadmap & Open Questions](#8-production-roadmap--open-questions)
9. [Limitations & Counterarguments](#9-limitations--counterarguments)
10. [Conclusion & Future Outlook](#10-conclusion--future-outlook)
11. [References](#11-references)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-02 | Course Design Team | Initial comprehensive course design document |

---

## 1. Executive Summary

We stand at a transformational moment in AI education. As large language models, tool-calling frameworks, and autonomous agents move from research labs into everyday workplace tools, a vast population of professionals finds itself caught between awareness and application. They read headlines about AI daily, they may experiment with chatbots casually, yet they lack the structured understanding needed to deploy AI confidently and critically in their own work. This gap is not primarily a technical one; it is a conceptual and practical one, rooted in the absence of curriculum designed specifically for learners who will never write production code but who must nonetheless make informed decisions about when, how, and why to use AI systems.

This document presents the comprehensive course design for "AI Foundations: Concept to Application," a 15-to-16-hour asynchronous e-learning experience targeting non-technical adult learners. The course is built on a single, clear thesis: it is possible to bridge the gap between AI awareness and practical application without requiring learners to master programming, mathematics, or systems engineering. Instead, the curriculum relies on metaphor-driven naming, a spiral curriculum structure, and a running project spine that carries a single learner-chosen artifact through progressively more sophisticated capabilities across eight carefully sequenced modules.

The eight-module architecture spans the full cognitive spectrum from Remember and Understand at the early modules, through Apply and Analyze in the middle sections, to Create and Evaluate in the capstone phase. Each module is named with an evocative metaphor—"The Intelligence Illusion," "The Goldfish Problem," "The Toolbelt," "The Engine Room," "The Assembly Line"—chosen to aid recall and reduce intimidation for learners unfamiliar with technical jargon. These names serve as cognitive anchors, grounding abstract concepts in familiar imagery.

The running project spine is the curriculum's most distinctive structural feature. At Module 0, each learner selects one of five project templates—a Research Companion, Content Engine, Inbox/Calendar Helper, Creative Studio, or Local-First Assistant—and then progressively enhances that same artifact across subsequent modules. This spiral device ensures that every new concept is immediately applied to a context the learner has already invested in, reinforcing retention and demonstrating the cumulative power of layered AI capabilities.

Delivery is planned via a custom web application hosted directly on the provider's website. This modern headless architecture leverages xAPI (Experience API) statements to capture granular interaction data—lab completions, tool invocations, workflow constructions—far beyond what traditional LMS tracking permits. This technical documentation serves as the authoritative blueprint for all subsequent authoring, development, and evaluation activities.

---

## 2. Research Foundation & Theoretical Basis

### 2.1 The AI Literacy Imperative

The urgency of AI literacy education is no longer a matter of debate; it is a matter of implementation. The UNESCO AI Competency Framework for Students (2024) defines 12 competencies across four dimensions—understanding AI, using AI, evaluating AI, and AI ethics—establishing a comprehensive baseline for what every educated individual should know about artificial intelligence. A companion framework for teachers articulates 15 competencies across five dimensions, recognizing that educators themselves must be AI-literate before they can guide others. These frameworks underscore a critical insight: AI literacy is not a single skill but a multidimensional capability set that spans knowledge, application, critical evaluation, and ethical reasoning.

The Digital Education Council's AI Literacy Framework complements UNESCO's work by identifying five key dimensions that define an AI-literate individual: conceptual understanding, practical competence, critical evaluation, ethical awareness, and adaptive learning. This multi-dimensional approach aligns closely with the design philosophy of this course, which does not treat AI literacy as merely "knowing what AI is" but as the ability to deploy, troubleshoot, and critically assess AI tools in real professional contexts.

Research by Chiu et al. (2025) further sharpens this distinction by differentiating AI literacy from AI competency. Literacy, they argue, encompasses the foundational knowledge and critical disposition needed to understand AI's capabilities and limitations. Competency adds the layer of practical application—the ability to use AI tools effectively to accomplish specific tasks. This course is designed to develop both dimensions in parallel, ensuring that learners do not merely learn about AI but learn to work with it productively and responsibly.

### 2.2 Target Audience Analysis

The primary audience for this course is non-technical adult learners: professionals working in fields such as marketing, operations management, business consulting, graphic design, financial analysis, human resources, and project management. These individuals recognize that AI is reshaping their industries and that acquiring AI skills is essential for career relevance, yet they approach the subject with understandable hesitation. They may have tried large language model chatbots and found them useful but shallow, or they may have been overwhelmed by the sheer volume of AI news, tools, and tutorials that assume a technical background they do not possess.

Coursera's 2026 AI course trends report highlights a dramatic increase in enrollment from non-technical professionals, with the fastest-growing segments being marketing and operations learners seeking practical AI application skills rather than theoretical foundations. DataCamp's analysis of AI learning paths for non-coders confirms this trend, noting that the most successful pathways for this audience emphasize conceptual clarity, hands-on experimentation with no-code or low-code tools, and immediate workplace relevance. The challenge of "breaking into AI without a technical background" is real but increasingly well-understood, and this course is designed to meet it directly.

Oregon State University's "Bloom's Taxonomy Revisited" framework for AI-era learning provides additional guidance, suggesting that AI literacy curricula should target higher-order cognitive skills earlier and more explicitly than traditional technical curricula. Because non-technical learners cannot fall back on code-level understanding, they must develop strong analytical and evaluative skills to assess AI outputs, identify failure modes, and make informed decisions about when AI is and is not appropriate for a given task. This insight directly informs the course's emphasis on critical evaluation throughout the module sequence.

### 2.3 Pedagogical Framework

The course's pedagogical design rests on three foundational pillars, each drawn from established educational theory and adapted for the specific challenges of AI literacy instruction for non-technical audiences.

#### 2.3.1 Bloom's Revised Taxonomy

Bloom's Revised Taxonomy, as articulated by Anderson and Krathwohl (2001), provides the cognitive scaffolding for the entire course. The taxonomy's six levels—Remember, Understand, Apply, Analyze, Evaluate, and Create—serve as both design targets and assessment anchors for each module. Module 0 (Orientation) and Module 1 (The Intelligence Illusion) target the Remember and Understand levels, asking learners to identify key concepts and explain how AI systems work at a high level. Module 3 (The Toolbelt) targets Apply, requiring learners to demonstrate tool-calling interactions. Module 4 (The Engine Room) bridges Analyze and Apply, asking learners to distinguish between different architectural components. Module 5 (The Assembly Line) targets Create, as learners design and build multi-step AI workflows. Module 7 (The Horizon) targets Evaluate and Create, requiring learners to critique AI solutions and present their own capstone projects.

Pace University's guide to writing learning objectives using Bloom's Taxonomy has informed the specific action verbs chosen for each module's learning objectives, ensuring that objectives are measurable and aligned with their intended cognitive level. This alignment is critical for assessment design and for communicating clear expectations to learners.

#### 2.3.2 Spiral Curriculum (Bruner)

Jerome Bruner's spiral curriculum model (1960) asserts that any subject can be taught effectively to any learner at any age, provided the material is structured as a spiral that revisits key concepts at increasing levels of depth and complexity. Cambridge Assessment's comparative analysis of spiral versus network curriculum models confirms that the spiral approach is particularly effective for learners who are new to a domain, because it builds confidence through progressive mastery of the same conceptual territory.

The running project spine is this course's primary spiral device. Learners select a single project template at Module 0 and then revisit and extend that same artifact in every subsequent module. In Module 1, they learn to write effective prompts for their project. In Module 2, they manage context limitations. In Module 3, they integrate tool calls. In Module 4, they explore agent-based orchestration. In Module 5, they build automated workflows. Each revisit deepens both the learner's understanding of the new concept and their mastery of the project itself. Research from the University of Cape Town, published in a PMC-indexed study on spiral curriculum implementation in online learning environments, found that spiral designs significantly improved retention and transfer compared to linear designs, particularly for adult learners in professional development contexts.

#### 2.3.3 ADDIE Model

The production process for this course follows the ADDIE instructional design model: Analyze, Design, Develop, Implement, Evaluate. The Analyze phase produced the audience analysis and needs assessment documented in Section 2.2. The Design phase is represented by this document, which specifies learning objectives, module structure, assessment strategy, and technical implementation. The Development phase will involve building the web application, authoring lesson content, configuring xAPI tracking, and producing media assets. Implementation will deploy the course to the custom web environment. Evaluation encompasses both formative assessment (xAPI-tracked lab checkpoints) and summative assessment (the capstone rubric). The eLearning Industry's guide to the ADDIE model and Litmos's best practices for e-learning development have informed the production workflow and quality assurance processes.

---

## 3. Course Architecture

### 3.1 Course Parameters

| Parameter | Specification |
|-----------|---------------|
| Course Title | AI Foundations: Concept to Application |
| Total Duration | 15–16 hours (comprehensive depth) |
| Delivery Format | Asynchronous e-learning |
| Packaging | Custom Web App / xAPI |
| Target Audience | Non-technical adult learners |
| Prerequisites | Basic computer literacy; no coding required |
| Module Count | 8 (Modules 0–7) |
| Assessment | Lab checkpoints (xAPI), capstone rubric |

### 3.2 Module Sequence & Pedagogical Rationale

| # | Module Name | Core Content | Est. Duration | Bloom's Level |
|---|-------------|--------------|---------------|---------------|
| 0 | Orientation | Course navigation, self-assessment, project template selection | 1.0 hr | Remember |
| 1 | The Intelligence Illusion | What AI is, how LLMs work, prompt anatomy, hallucinations & bias | 2.0 hrs | Remember, Understand |
| 2 | The Goldfish Problem | Context windows, tokens, RAG, "lost in the middle" | 2.0 hrs | Understand |
| 3 | The Toolbelt | Function calling, MCP, tools & capabilities | 2.0 hrs | Apply |
| 4 | The Engine Room | Harness vs. model, agents, guardrails, orchestration | 2.0 hrs | Analyze, Apply |
| 5 | The Assembly Line | Multi-step workflows, parallel agents, sub-labs | 3.0 hrs | Create |
| 6 | The Local Sandbox | On-device AI, SLMs, local vs. cloud tradeoffs | 1.5 hrs | Understand |
| 7 | The Horizon | Resource curation, continuous learning, capstone presentation | 2.5 hrs | Evaluate, Create |

### 3.3 Running Project Spine

At Module 0, each learner selects one of five project templates:

| # | Template Name | Description | Built? |
|---|---------------|-------------|--------|
| 1 | The Research Companion | Answers questions using current information combined with the learner's own notes | ✅ Shipped (`research_companion`) |
| 2 | The Content Engine | An ideation-to-draft-to-critique loop for written content production | ✅ Shipped (`content_engine`) |
| 3 | The Inbox/Calendar Helper | Triages incoming messages and drafts responses on the learner's behalf | ⏳ Reserved for v1.1 |
| 4 | The Creative Studio | Maintains consistent character and style across generated images and media | ✅ Shipped (`creative_studio`) |
| 5 | The Local-First Assistant | A Research Companion variant designed to optionally run offline | ⏳ Reserved for v1.1 |

Per §8.1, the launch scope ships three templates — Research Companion, Content Engine, and Creative Studio — which align to the three Module 5 sub-labs (content, coding, media). The two reserved templates will be developed based on initial learner demand.

The selection is captured via an xAPI statement (verb: "selected_template"), enabling the LMS to provide template-specific examples and context throughout the course. As learners progress through Modules 1 through 5, each module's lab exercises require them to apply the new concept to their chosen project template. In Module 1, they write effective prompts for their project. In Module 2, they manage context limitations specific to their project's use case. In Module 3, they add tool-calling capabilities. In Module 4, they explore agent-based orchestration for their project. In Module 5, they build a complete automated workflow. This spiral curriculum mechanic ensures that every new concept is immediately contextualized within a project the learner already understands and cares about, dramatically improving both engagement and retention.

---

## 4. Detailed Module Specifications

### 4.1 Module 0: Orientation

**Metaphor:** The metaphor for this module is implicit in its name: "Orientation." Just as a map orients a traveler to their surroundings before they set out, this module orients the learner to the entire course landscape, establishing expectations, dispelling misconceptions, and providing a self-assessment framework that helps learners identify their starting point on the AI literacy spectrum.

**Learning Objectives**

- Complete a self-assessment diagnostic to identify current AI knowledge level
- Articulate at least two personal learning goals for the course
- Select a running project template and explain why it aligns with their professional context
- Navigate core LMS features including progress tracking and discussion forums

**Lesson Breakdown**

*Lesson 0.1: Welcome and Roadmap* — An overview of the course structure, the metaphor-driven naming convention, and the running project spine concept. Learners are introduced to the eight-module arc and the pedagogical rationale behind the sequencing.

*Lesson 0.2: Myth-Busting* — Three common misconceptions are addressed directly: (a) AI is not sentient—it is pattern recognition and probabilistic generation, not consciousness; (b) AI is not magic—it operates on understandable principles, even if the specifics involve complex mathematics; (c) AI is not a replacement for human judgment—it is a tool that augments human capability. Each myth is presented with a clear, accessible explanation and a brief real-world example.

*Lesson 0.3: Self-Assessment Diagnostic* — A brief, ungraded self-assessment helps learners identify their current familiarity with AI concepts. This is not a gatekeeping exercise; it is a self-awareness tool that helps learners calibrate their expectations and identify which modules may require more attention.

*Lesson 0.4: Project Template Selection* — Learners review the five project templates and select one. The selection is captured as an xAPI statement ("selected_template") for branching personalization throughout the course.

**Key Concepts**

AI literacy spectrum, growth mindset, metacognition, self-directed learning, project-based learning. *Estimated duration: 1.0 hour.*

#### Built Implementation (v1, Module 0)

Module 0 is fully shipped as a `CanvasViewer` slide deck of 9 slides in `src/app/page.tsx`. Each slide is `type: "interactive"` and `fullWidth: true`; several enforce `requireCompletion: true` to gate forward navigation. Voiceover audio tracks live in `public/audio/` (e.g. `welcome-attention.mp3`, `myth-busting.mp3`, `diagnostic-assessment.mp3`, `confidence-pulse.mp3`, `welcome-tie.mp3`, `project-selector.mp3`, `welcome-vision-video.mp3`, `what-is-gen-ai.mp3`).

| # | Slide ID | Component | Lesson 0.x | Built behavior |
|---|---|---|---|---|
| 1 | `welcome-attention` | `WelcomeAttentionSlide` | 0.1 Welcome and Roadmap | GSAP-synced reveal of welcome heading + 3 body paragraphs over a Waveform-bot right-column image; auto-locked narration until user clicks "Begin Module" |
| 2 | `welcome-vision-video` | `VisionRoadmapSlide` | 0.1 | Video thumbnail card + leadership message CTA; intro animation pairs with narration timing |
| 3 | `what-is-gen-ai` | `WhatIsGenAISlide` | 0.1 | YouTube embed (Bernard Marr's 5-min primer) + "Mark Watched" callback; `requireCompletion` gated by it |
| 4 | `confidence-pulse` | `ConfidenceCheck` | 0.3 | Self-assessment selector of 3 confidence levels (Just exploring / Occasional user / Daily driver); logs baseline confidence via xAPI; overrides nav button as "Record & Continue" |
| 5 | `myth-busting` | `MythBustingSlide` | 0.2 Myth-Busting | Three myth cards (AI is Sentient / AI is Magic / AI Replaces Human Judgment) revealed one-by-one on narration timeline; each with a "The Reality" rebuttal |
| 6 | `diagnostic-attention` | `DiagnosticAttentionSlide` | 0.3 Self-Assessment Diagnostic | Attention-getter before the assessment, frames the diagnostic as a baseline, not graded |
| 7 | `diagnostic-assessment` | `AssessmentRunner kind="baseline"` | 0.3 | 10-question pulled from `src/lib/question-bank.ts`; animated correct/incorrect feedback overlays; per-module score breakdown; xAPI "attempted" + "answered" + "completed" statements |
| 8 | `welcome-tie` | `WelcomeTieSlide` | 0.4 Project Template Selection | "Learning by Doing" framing — introduces the running project spine concept; GSAP-synced three-paragraph reveal |
| 9 | `project-selector` | `ProjectSpineSelector` | 0.4 | Three project spines selectable as glass cards (`research_companion`, `content_engine`, `creative_studio`); selection fires `selected_template` xAPI statement, marks Module 0 complete, and routes to `/modules/1` |

**Project spines shipped (3 of 5 planned per §8.1):** Research Companion, Content Engine, Creative Studio. The Inbox/Calendar Helper and Local-First Assistant remain reserved for v1.1.

**Cross-cutting behaviors built:** progress tracking via `useProgressStore` (Zustand, persisted); narration playback via `useNarrationStore` (Zustand, transient); per-slide xAPI statements via `sendXAPIStatement` server action; navigation override context (`CanvasNavContext`) — lets any slide hijack the deck's "Next" button (e.g. Assessments rename it to "Submit Answer", the Project Selector renames it to "Submit & Continue").

---

### 4.2 Module 1: The Intelligence Illusion

**Metaphor:** The name "The Intelligence Illusion" captures the core insight that AI's apparent intelligence is a performance, not a cognition. Large language models produce text that seems thoughtful and knowledgeable, but their underlying mechanism is statistical pattern matching, not reasoning. This module equips learners to see behind the curtain—to understand what AI actually is, how it works at a conceptual level, and where its fundamental limitations lie.

**Learning Objectives**

- Distinguish between AI, machine learning, large language models, and small language models
- Explain at a high level how LLMs generate text through next-token prediction
- Deconstruct a prompt into its constituent components (role, task, context, constraints)
- Identify and explain common LLM limitations including hallucinations and bias

**Lesson Breakdown**

*Lesson 1.1: What AI Actually Is* — This lesson contrasts the Hollywood version of AI (sentient robots, conscious systems) with the reality of narrow AI systems that perform specific tasks by recognizing patterns in data. Key distinction: general intelligence versus narrow/task-specific AI.

*Lesson 1.2: Machine Learning in Plain Language* — An accessible explanation of how machine learning works, using analogies like learning to recognize handwriting from examples. The core idea: instead of programming explicit rules, we provide examples and let the system discover patterns.

*Lesson 1.3: Large Language Models and Small Language Models* — LLMs are trained on vast datasets and possess broad general knowledge, as documented by Zhao et al. (2024) in their comprehensive survey (arXiv:2402.06196). SLMs are smaller models that retain core natural language processing capabilities while being suitable for deployment on edge devices with limited computational resources. The HuggingFace SLM overview and Red Hat's SLM vs. LLM comparison provide the technical grounding for this lesson.

*Lesson 1.4: Anatomy of a Prompt* — Drawing on the Springer systematic review of prompt engineering in higher education, this lesson teaches learners to decompose effective prompts into four components: role definition, task specification, contextual background, and output constraints. Learners practice writing and iterating prompts for their running project.

*Lesson 1.5: Where AI Stumbles: Hallucinations and Bias* — An honest, non-technical explanation of why AI systems sometimes produce confident but incorrect information (hallucinations) and why they may reflect biases present in their training data. Learners learn to recognize warning signs and apply verification strategies.

**Key Concepts**

Neural networks (high-level), training data, parameters, inference, tokens, temperature, top-p, SLM vs. LLM tradeoffs, hallucination, bias, prompt engineering, next-token prediction. *Estimated duration: 2.0 hours.*

#### Built Implementation (v1, Module 1)

Module 1 is shipped as a 17-slide `CanvasViewer` deck defined in `src/components/modules/m1/index.tsx` (~1900 LOC) and routed from `src/app/modules/[id]/page.tsx` when `moduleId === "1"`. Each slide is `type: "interactive"`, `fullWidth: true`. Slides with narration tracks use `narrationText` (string) for the CanvasViewer-managed audio engine OR `hasCustomAudio: true` for slides that own their audio lifecycle (timeline, hollywood, ml-intro, ml-supervised, ml-unsupervised, ml-reinforcement, neural-networks, generative-ai, next-token). All content slides are gate-able via `requireCompletion: true`. The deck covers the full Module 1 learning objectives from Remember/Understand (Bloom) and **fully implements through the ML → Deep Learning → AI section** (i.e. through the Generative AI / Transformer / Next-Token Predict arcs).

| # | Slide ID | Component | Built behavior |
|---|---|---|---|
| 1 | `m1-title` | `TitleSlide` | Hero slide splitting "The Intelligence Illusion" headline with a Transformer Engine mockup; left-column list of "Not a knowledge base / Not a reasoning engine / A stochastic parrot" reveals sync to narration timeline |
| 2 | `m1-video-whatis` | `VideoSlide` | Google Cloud Tech "Generative AI Explained" YouTube embed with "Mark Watched" callback, gating completion |
| 3 | `m1-timeline` | `TimelineOfAI` | Interactive 5-milestone timeline (1950 Turing Test → 1997 Deep Blue → 2012 AlexNet → 2017 Transformers → 2022 ChatGPT); progressive unlock as each milestone's narration finishes; radar-ping ring on next-target node; hyperlinks the original "Attention Is All You Need" arXiv paper |
| 4 | `m1-hollywood` | `HollywoodVsReality` | Two-card compare/contrast (AGI vs. Narrow AI). Reveal sequence synced to `m1-hollywood.mp3` (audio-driver); each card's bullet list and status badge animate in based on `audio.currentTime` thresholds |
| 5 | `m1-assessment-1` | `Assessment1` | Inline 10-question multiple-choice formative quiz (must-answer-all-correctly). Animated correct/incorrect glass overlay with explanation; accepts retry on wrong answers; uses `CanvasNavContext` to re-label "Next" as "Submit" / "Continue". *Note — this is a slide-local quiz kept inside Module 1 for the "what AI is" section; it is distinct from the bank-driven `AssessmentRunner` used in the Module 0 baseline diagnostic and future final exam.* |
| 6 | `m1-ml-intro` | `MachineLearningIntroSlide` | Minimal premium title slide ("Machine Learning") with bilingual phase animation (phase1/phase2 keyed off `audio.currentTime`); introduces the "give data, discover patterns" paradigm |
| 7 | `m1-ml-supervised` | `SupervisedLearningSlide` | Concept slide base used for all three ML paradigms — image + definition + Classroom-with-Answer-Key analogy |
| 8 | `m1-ml-unsupervised` | `UnsupervisedLearningSlide` | Same base — Library Archeologist analogy, hidden-structure discovery |
| 9 | `m1-ml-reinforcement` | `ReinforcementLearningSlide` | Same base — Trial-and-Error Apprentice, reward/penalty loop |
| 10 | `m1-neural-networks` | `NeuralNetworksSlide` | **Deep Learning** concept slide — neural_network hero image, glass overlay paragraph explaining hidden layers, weights, and biases |
| 11 | `m1-generative-ai` | `TransformersSlide` | **Transformer architecture** concept slide — attention mechanism explanation with the cyan/teal transformer_attention image and glass overlay caption |
| 12 | `m1-next-token` | `NextTokenSlide` | **Interactive Next-Token Prediction Simulator** — Temperature + Top-P sliders drive a live softmax+top-p calculation across four sample tokens (`mat / floor / sofa / moon`); animated probability bars respond in real time. Teaches "AI doesn't think; it predicts" by direct manipulation |
| 13 | `m1-llm-vs-slm` | `LlmVsSlm` | Toggle compare/contrast of Large vs. Small Language Models — Cloud icon + GPT-4/Claude/Gemini vs. Smartphone icon + Phi-3/Llama 3 8B/Gemma. Animated knowledge-breadth / cost / privacy bars |
| 14 | `m1-anatomy` | `AnatomyOfPrompt` | Two-pane interactive: mock `prompt.txt` editor (left) shows the four anatomical components as clickable blocks; clicking each one reveals its purpose in the right pane (Role / Task / Context / Constraints). Hijacks the deck's "Next" via `setNavOverride` |
| 15 | `m1-hallucination` | `HallucinationSlide` | "What is the population of Mars?" example — the LLM's confident-but-wrong answer animates with a chromatic-aberration glitch, then a red warning overlay stamps it as "Factually Incorrect" |
| 16 | `m1-bias` | `BiasInAI` | Two-pane training-data-vs-model-output demo. The training-data card shows gendered-language sentences; clicking "Train AI Model" animates a generated CEO/nurse story on the right that highlights the inherited bias with orange markers |
| 17 | `m1-quiz` | `Module1Quiz` | Final 3-question *knowledge check* — the module's Bloom's Understand-level assessment. Each question shows a glass "Correct / Not quite" panel with explanation; uses `setNavOverride` to relabel the "Next" button as "Check Answer" / "Next Question" / "Submit & Complete Module" |

**Lesson-to-slide mapping**

| Blueprint lesson | Built slides |
|---|---|
| 1.1 What AI Actually Is | slides 1–5 (title, video, AI timeline, Hollywood vs Reality, Assessment 1) |
| 1.2 Machine Learning in Plain Language | slides 6–10 (ML intro + three paradigms + Deep Learning / Neural Networks) |
| 1.3 Large Language Models and Small Language Models | slide 13 (LLM vs SLM toggle) — and conceptually grounded by slides 11–12 (Transformer + next-token) |
| 1.4 Anatomy of a Prompt | slide 14 |
| 1.5 Where AI Stumbles: Hallucinations and Bias | slides 15–16, plus closing quiz at slide 17 |

**Built scope note (as of last build session):** the deck runs continuously from slide 1 through slide 17. Slides through `m1-generative-ai` (Transformer architecture) and `m1-next-token` (Next-Token Prediction) implement the AI-generation explanation arc; slide 13 (`LlmVsSlm`), 14 (Prompt Anatomy), 15 (Hallucination), 16 (Bias), and 17 (Module 1 final quiz) extend the deck into practical-use-of-LLMs territory. No content beyond these 17 slides has been authored for Module 1; Module 2 onwards is **not yet built** (the dynamic route falls through to a placeholder for any module other than 1).

---

### 4.3 Module 2: The Goldfish Problem

**Metaphor:** The goldfish metaphor captures the experience of conversing with an AI that seems to "forget" earlier parts of a long conversation. Like a goldfish in a small bowl, the AI has limited short-term memory—its context window. Once the conversation exceeds that window, earlier information effectively falls out of reach. This module teaches learners to understand, measure, and work around this fundamental constraint.

**Learning Objectives**

- Define what context windows and token limits are and why they matter
- Explain why AI appears to "forget" long conversations at a conceptual level
- Describe Retrieval-Augmented Generation (RAG) at a conceptual level
- Evaluate when context management strategies are necessary for a given task

**Lesson Breakdown**

*Lesson 2.1: The Goldfish Metaphor* — AI's short-term memory is limited. This lesson introduces the concept through relatable scenarios: asking an AI to summarize a long document, or maintaining a multi-session project conversation. The metaphor makes the abstract concept of context windows immediately tangible.

*Lesson 2.2: Tokens: The Currency of AI* — What tokens are, how text is broken into subword units, and why token count matters more than word count. Learners see concrete examples of how the same English sentence might use different numbers of tokens depending on the tokenization scheme.

*Lesson 2.3: Context Windows Explained* — Drawing on the IBM Think article on context windows, this lesson provides a clear explanation of what context windows are, how they vary across models (from 8,000 tokens to over 1 million), and the practical implications for learners' project work. The Tech Policy Institute's analysis of context window scaling provides additional data points.

*Lesson 2.4: RAG: Giving AI a Long-Term Memory* — At a conceptual level, this lesson explains how Retrieval-Augmented Generation works: a retriever component searches a knowledge base for relevant information, and a generator component (the LLM) uses that retrieved information to produce a response. The Pinecone RAG overview and Google Cloud's RAG documentation serve as reference materials.

*Lesson 2.5: Practical Implications* — Chunking strategies, summarization techniques, and strategic prompting approaches that help learners work within context window constraints. The "lost in the middle" phenomenon—where LLMs pay less attention to information in the middle of long contexts—is introduced as a key insight for effective prompt design.

**Key Concepts**

Token (subword unit), context window (8K to 10M tokens across models), "lost in the middle" phenomenon, RAG architecture (retriever + generator), vector databases (conceptual), embeddings (conceptual), chunking, summarization. *Estimated duration: 2.0 hours.*

---

### 4.4 Module 3: The Toolbelt

**Metaphor:** Just as a carpenter's toolbelt contains specialized tools for different tasks—a hammer for driving nails, a saw for cutting wood—an AI's "toolbelt" contains capabilities that extend its core text-generation abilities. Without tools, an LLM can only generate text. With tools, it can search the web, query databases, send emails, generate images, and execute code. This module teaches learners how tools work and how a new standard called MCP promises to make them universally interoperable.

**Learning Objectives**

- Explain the concept of function/tool calling and how it extends AI capability
- Describe the Model Context Protocol (MCP) and its role as a universal connector
- Identify scenarios where tools add meaningful value to AI interactions
- Demonstrate basic tool interaction patterns within the running project context

**Lesson Breakdown**

*Lesson 3.1: From Chat to Action: Why Tools Matter* — A motivational overview that shows learners what becomes possible when AI systems can take action, not just generate text. Examples include booking a calendar appointment, querying a live database, or generating an image from a description.

*Lesson 3.2: Function Calling Demystified* — Drawing on Martin Fowler's article on function calling and Symflower's LLM function calling guide, this lesson explains the mechanism: the LLM identifies that a function should be called and specifies the parameters in a structured format (typically JSON), but does not execute the function itself. A separate runtime component performs the execution. This separation of concerns is critical for safety and control.

*Lesson 3.3: MCP: The Universal Translator* — The Model Context Protocol, introduced by Anthropic in November 2024, is an open standard that enables AI systems to connect with external data sources and tools in a standardized way. The MCP specification (2025-06-18 version) defines how MCP hosts, clients, and servers interact. The protocol supports multiple programming languages including TypeScript, Python, Java, Kotlin, C#, Go, PHP, Ruby, Rust, and Swift. This lesson explains MCP at a conceptual level, using the analogy of a universal plug adapter that lets any device connect to any power outlet.

*Lesson 3.4: Skills and Capabilities* — A survey of what tools can actually do: web search, file system access, API calls, code execution, image generation, email integration. Learners map these capabilities to their running project template.

*Lesson 3.5: Hands-On: Triggering a Tool Call* — A guided exercise where learners construct a prompt that triggers a tool call, observe the structured output, and reflect on how this pattern could enhance their running project.

**Key Concepts**

Function calling (LLM identifies function + parameters in JSON, does not execute), MCP (open standard for AI-external data integration), MCP hosts, clients, servers, tool registries, permission management. *Estimated duration: 2.0 hours.*

---

### 4.5 Module 4: The Engine Room

**Metaphor:** If the AI model is the engine that powers text generation, then the "engine room" is the orchestration layer—the harness—that controls how that engine is used. A raw engine is powerful but dangerous without a transmission, steering, and brakes. Similarly, a raw LLM needs a harness to manage its behavior, connect it to tools, maintain memory, and enforce guardrails. This module teaches learners to distinguish between the underlying model and the orchestration layer, and to understand how agents emerge from that distinction.

**Learning Objectives**

- Distinguish between AI harnesses and the underlying models they orchestrate
- Explain the core components of agent architecture (autonomy, tools, memory)
- Identify when agents add value over single-prompt interactions
- Evaluate agent reliability, failure modes, and the importance of guardrails

**Lesson Breakdown**

*Lesson 4.1: Harness vs. Model: The Critical Distinction* — This lesson uses a real-world example to illustrate the harness concept: a video generation platform like HeyGen, which creates hyper-realistic AI avatars, may power its voice component using a separate voice model like ElevenLabs rather than building everything from scratch. The harness is the orchestration layer that coordinates these components. The HeyGen vs. Synthesia comparison and ElevenLabs documentation provide concrete examples.

*Lesson 4.2: What Makes an Agent: Autonomy, Tools, Memory* — Drawing on Anthropic's research on effective harnesses for long-running agents, this lesson breaks down the three defining characteristics of AI agents: they operate autonomously (making decisions without step-by-step human guidance), they call tools (accessing external systems), and they maintain memory (carrying context across interactions). Each characteristic is illustrated with examples relevant to the learner's running project.

*Lesson 4.3: The Agent Spectrum* — Not all agents are the same. This lesson introduces a spectrum from simple tool-calling agents (one LLM call that may optionally call a tool) through multi-step agents (iterative loops) to complex multi-agent systems (multiple specialized agents collaborating). Frameworks like CrewAI are mentioned as representative of the multi-agent end of the spectrum, following the conceptual framework outlined in their documentation.

*Lesson 4.4: When Agents Break* — An honest look at agent failure modes: cascade failures where one error propagates through the entire chain, loops where agents get stuck repeating the same action, hallucination amplification where each step compounds earlier inaccuracies, and cost explosion where unbounded agent loops rack up unexpected API charges. Learners are taught systematic strategies for identifying and mitigating each failure mode.

*Lesson 4.5: Guardrails and Safety* — The importance of limiting agent autonomy through permission systems, human-in-the-loop review checkpoints, and explicit constraints on tool access and decision authority. Learners map potential guardrails for their running project.

**Key Concepts**

Harness, orchestration layer, autonomy, tool access, memory, simple agents, multi-step agents, multi-agent systems, CrewAI, cascade failure, loops, cost explosion, guardrails, human-in-the-loop. *Estimated duration: 2.0 hours.*

---

### 4.6 Module 5: The Assembly Line

**Metaphor:** An assembly line is a sequence of specialized workstations that each perform a specific operation on a product as it moves down the line. This module teaches learners to think of AI workflows as assembly lines: sequences of operations where the output of one step becomes the input of the next, with different AI capabilities invoked at each station in the line. This module is the hands-on centerpiece of the course, where learners build their most sophisticated AI-powered workflow.

**Learning Objectives**

- Identify opportunities for AI automation in professional workflows
- Design a multi-step AI workflow with clearly defined stages
- Evaluate the role of human oversight in automated AI processes

**Sub-Lab Structure**

Module 5 is structured as three parallel sub-labs, each focusing on a different professional domain. Learners complete all three, but the running project template determines which sub-lab receives the most emphasis.

1. **Content Sub-Lab:** An ideation-to-draft-to-critique-to-revision loop, ideally suited to the Content Engine project template. Learners design a workflow where AI generates initial content ideas, expands the selected idea into a draft, critiques the draft against a rubric, and produces a revised version. Field Notes cover Claude Code, Cursor, and Codex, drawing on Anthropic's 2026 Agentic Coding Trends Report and the arXiv configuration study (2602.14690).

2. **Coding Sub-Lab:** A specification-to-generation-to-testing-to-iteration loop. Learners describe a desired output in plain language, use AI to generate a solution, review the output for correctness, and iterate. Field Notes cover n8n (a visual/low-code workflow automation platform, as documented on n8n.io and in the HatchWorks n8n article) and Zapier/Make as no-code alternatives for learners who prefer not to use visual programming environments.

3. **Media Sub-Lab:** A script-to-generation-to-review-to-publication loop. Learners write a brief script or description, use AI to generate media (video, images, or audio), review the output for quality and brand alignment, and prepare it for publication. Field Notes cover HeyGen (hyper-realistic AI avatars in 175+ languages), Synthesia (enterprise-focused L&D platform in 140+ languages), and ElevenLabs (AI voice generation with 5,000+ voices in 70+ languages), drawing on the HeyGen vs. Synthesia comparison and ElevenLabs documentation.

Each sub-lab ships with a Field Notes one-pager that is versioned separately from the core course content, allowing tool-specific information to be updated without redeploying the entire web app. *Estimated duration: 3.0 hours.*

---

### 4.7 Module 6: The Local Sandbox

**Metaphor:** A sandbox is a safe, contained environment where you can experiment without consequences. This module treats local AI—running AI models on your own device rather than in the cloud—as a sandbox: a space where learners can explore the concepts of on-device AI without needing to set up complex hardware or software environments. The treatment is awareness-level only, providing conceptual understanding without hands-on setup requirements.

**Learning Objectives**

- Describe the capabilities and constraints of local AI at a conceptual level
- Understand when local AI deployment makes sense and when cloud AI is preferable
- Identify the hardware and software requirements for running AI locally

**Lesson Breakdown**

*Lesson 6.1: Why Run AI Locally?* — Three primary motivations: privacy (sensitive data never leaves the device), cost (no per-query API fees), and offline access (AI availability without internet connectivity). Each motivation is illustrated with a professional scenario.

*Lesson 6.2: Small Language Models on Your Device* — Drawing on the Red Hat open source AI models article, Pinggy's guide to local LLM tools, and AI Magic X's on-device AI guide, this lesson explains how SLMs can be compressed through knowledge distillation and quantization (as documented by HuggingFace) to run on consumer hardware. The arXiv paper on edge-first language model inference (2505.16508) provides the research basis for understanding the performance tradeoffs.

*Lesson 6.3: Tools for Running Local AI* — An awareness-level survey of popular tools including Ollama and RamaLama. Learners are not expected to install or configure these tools; the goal is to know they exist and understand their purpose.

*Lesson 6.4: When Cloud Beats Local and Vice Versa* — A decision framework that helps learners evaluate whether a given use case is better served by local or cloud AI, considering factors like data sensitivity, model capability requirements, latency, and cost.

**Key Concepts**

On-device inference, SLMs, knowledge distillation, quantization, edge computing tradeoffs, Ollama, RamaLama, privacy benefits, offline access. *Estimated duration: 1.5 hours.*

---

### 4.8 Module 7: The Horizon

**Metaphor:** The horizon represents both the future and the limit of what we can see from our current vantage point. This module is about looking forward: curating a personal resource library for continued learning, developing strategies for staying current in a rapidly evolving field, and presenting the capstone project that demonstrates the learner's accumulated knowledge and skills.

**Learning Objectives**

- Curate a personal AI resource library relevant to their professional domain
- Develop a concrete strategy for staying current with AI developments
- Present a capstone project that demonstrates integrated AI application skills
- Reflect on their learning journey and identify next steps for continued growth

**Lesson Breakdown**

*Lesson 7.1: The Living Tool Landscape* — The Tool Landscape is a curated, versioned resource that lists current AI tools organized by category. Because the tool market evolves rapidly, this resource is maintained separately from the core course content and refreshed quarterly. Learners are introduced to the resource and encouraged to bookmark it for ongoing reference.

*Lesson 7.2: Building Your AI Learning Habit* — Practical strategies for continuous learning: subscribing to key newsletters, following thought leaders, participating in professional communities, and setting aside regular time for experimentation. The emphasis is on sustainable habits, not information overload.

*Lesson 7.3: Capstone Project Presentations* — Learners present their completed running project, demonstrating how they applied each module's concepts to their chosen template. The presentation is structured as a recorded walkthrough with reflection on design decisions, challenges encountered, and lessons learned.

*Lesson 7.4: Course Retrospect and Next Steps* — A guided reflection exercise where learners review their self-assessment from Module 0, identify how their understanding has evolved, and articulate their next learning goals. This lesson closes the learning loop, providing a sense of accomplishment and a clear path forward.

**Key Concepts**

Tool Landscape, continuous learning strategy, capstone presentation, learning reflection, personalized action plan. *Estimated duration: 2.5 hours.*

---

## 5. Tool Landscape Integration Strategy

A central challenge in designing AI curriculum is the breakneck pace of tool market evolution. A tool that is market-leading at the time of course authoring may be obsolete within six months. This course addresses this challenge through a two-pronged strategy: conceptual stability combined with tool-specific separation.

The core course content teaches concepts, frameworks, and patterns that are not tool-dependent. The anatomy of a prompt, the structure of a context window, the mechanism of function calling, and the architecture of an agent are durable concepts that will remain valid even as specific tools come and go. These concepts form the stable spine of the course.

Tool-specific information is contained in two types of separately versioned resources:

1. **Field Notes:** One-page briefs that accompany specific lessons, providing current information about specific tools, platforms, and services. Field Notes are versioned independently and can be updated without redeploying the entire web application.

2. **The Tool Landscape:** A curated, categorized directory of AI tools, organized by function and use case. This resource is maintained as a living document with quarterly refresh cycles, independent of the main deployment schedule.

This separation strategy ensures that the durable conceptual content—how AI works, how to think about agents, how to evaluate AI outputs—remains stable and durable, while the tool-specific details that are inherently perishable are isolated in easily updatable components.

---

## 6. Assessment Strategy & Capstone Design

A critical design principle for this course is that assessment must verify application, not just completion. Traditional e-learning often reduces assessment to "did the learner click through all the slides?" This course leverages xAPI's granular tracking capabilities to measure what learners actually do, not just what they view.

### 6.1 xAPI Lab Checkpoints

Each module includes at least one interactive lab exercise that generates an xAPI statement capturing the learner's action. The xAPI specification's noun-verb-object statement structure (Actor → Verb → Object) enables rich, granular tracking that goes far beyond traditional completion-based models. Examples of xAPI statements generated by this course include: "learner completed_lab Module 3 Lab 1," "learner invoked_tool web_search," "learner built_workflow content_sub_lab," and "learner submitted_capstone." As documented on xAPI.com, these statements are stored in a Learning Record Store (LRS) and can be analyzed to identify learning patterns, at-risk learners, and areas where instructional content may need improvement.

### 6.2 Capstone Rubric

The Module 7 capstone project is evaluated against a four-dimension rubric designed to assess both technical understanding and critical thinking:

| Dimension | Description | Weight |
|-----------|-------------|--------|
| Technical Functionality | Does the AI solution work as intended? Does it produce the expected output for the given input? | 30% |
| Workflow Complexity | Does the project demonstrate multi-step orchestration? Are tools and/or agents integrated effectively? | 25% |
| Critical Evaluation | Can the learner articulate the solution's limitations, potential failure modes, and scenarios where it would not be appropriate? | 25% |
| Presentation Quality | Is the solution communicated clearly? Is the demonstration structured and professional? | 20% |

This rubric draws on research in AI-enabled assignment rubric design, which emphasizes the importance of assessing not just the technical output but the learner's ability to critically evaluate that output—a skill that becomes increasingly important as AI tools become more capable and more pervasive.

### 6.3 Bloom's-Aligned Assessment

Each module's assessment activities are aligned with the Bloom's taxonomy level targeted by that module. Remember-level modules use identification and recall tasks. Understand-level modules use explanation and classification tasks. Apply-level modules require demonstration of skills in context. Analyze-level modules require comparison and deconstruction. Create-level modules require original work product. Evaluate-level modules require judgment and critique. This alignment ensures that assessment is both valid (measuring what it intends to measure) and progressive (building toward higher-order skills across the course).

---

## 7. Custom Web Architecture & xAPI Implementation Plan

The course's technical delivery strategy utilizes a custom web application architecture combined with xAPI to achieve full control over the user experience and deep tracking. A modern web stack (e.g., Next.js/React) is used for the front-end delivery, completely bypassing the need for a traditional LMS. xAPI (Experience API) is embedded directly into the application to capture the granular interaction data that traditional platforms cannot represent.

The key advantage of xAPI in a custom architecture is its flexibility. Traditional models track completion, score, and time—a small, fixed set of metrics. xAPI tracks any actor-verb-object statement, making it possible to capture the specific actions that indicate genuine learning: which labs a learner completed, which tools they invoked, which workflows they built, and how they performed on the capstone. These statements are transmitted directly from the web application to a standalone Learning Record Store (LRS), which can be queried for analytics and reporting.

The xAPI statements generated by this course fall into four categories: (1) project template selection at Module 0, (2) lab completions at each module checkpoint, (3) tool interactions during Module 3–5 exercises, and (4) capstone submission at Module 7. Each statement follows the xAPI.com best practice guidelines for statement structure and vocabulary.

A critical architectural decision is the separation of versioned components. The core web application contains the stable conceptual content (lessons, explanations, exercises) and is expected to change infrequently. The Field Notes documents and the Tool Landscape resource are versioned separately and can be updated independently (e.g., via a headless CMS), absorbing the churn of a rapidly evolving tool market without requiring full application redeployment. This separation is essential for maintaining course currency while minimizing production overhead.

---

## 8. Production Roadmap & Open Questions

This document represents the Design phase of the ADDIE model. The following open questions and recommendations will guide the transition to Development, Implementation, and Evaluation.

### 8.1 Launch Scope

**Recommendation:** Ship three project templates at launch (Research Companion, Content Engine, and Creative Studio) with the Inbox/Calendar Helper and Local-First Assistant added in v1.1. The rationale is that the initial three templates cover the three professional domains addressed by Module 5's sub-labs (content, coding, and media), providing a complete learning experience while reducing the initial authoring burden. The additional two templates can be developed based on learner feedback and demand data from the initial launch.

### 8.2 Assessment Design

The capstone rubric proposed in Section 6 provides a starting framework, but the specific scoring criteria for each dimension will need to be calibrated during the Development phase with sample learner submissions. The xAPI-tracked lab checkpoints are defined at the statement level in this document; the technical implementation of each checkpoint will be specified during Development.

### 8.3 Lesson-Level Objectives

Each module's lessons need specific, Bloom's-targeted learning objectives that are more granular than the module-level objectives provided in Section 4. These lesson-level objectives will be defined during the Development phase as instructional content is authored, ensuring tight alignment between what is taught and what is assessed.

### 8.4 Refresh Cadence

A quarterly refresh cycle is recommended for the Tool Landscape resource, given the current rate of tool market churn. The core course content should be reviewed semi-annually for accuracy and relevance, with full course revisions on an annual cycle. This tiered approach balances the need for currency with the practical constraints of instructional design production.

### 8.5 ADDIE Phase Transition

This document concludes the Design phase. The next steps are: (1) Development—building the web application front-end, authoring lesson content, building xAPI interaction triggers, and producing media assets; (2) Implementation—deploying the web application, configuring the LRS, and conducting a pilot with a small cohort of representative learners; (3) Evaluation—analyzing pilot data, identifying content areas that need revision, and refining the capstone rubric based on actual learner submissions.

---

## 9. Limitations & Counterarguments

### 9.1 Tool-Specific Content Aging

The most obvious limitation of any AI course is the pace at which tool-specific content becomes outdated. This course mitigates this risk through the Field Notes separation strategy and Tool Landscape versioning described in Section 5. However, even conceptual content may need updating as the field evolves—for example, if a new paradigm emerges that supersedes RAG or MCP. The quarterly review cycle provides a mechanism for identifying and addressing such shifts, but it cannot guarantee that the course will always reflect the absolute latest developments.

### 9.2 Non-Technical Depth Ceiling

The course prioritizes conceptual depth and practical application over code-level understanding. This is a deliberate design choice, but some learners—particularly those with engineering-adjacent roles—may find Modules 3 through 5 challenging because they stretch the boundaries of what can be conveyed without programming. The running project spine provides scaffolding by anchoring abstract concepts in a concrete, personally relevant context, and the lab exercises are designed to be accessible through no-code or low-code interfaces. However, learners who seek deeper technical understanding may need to pursue follow-up courses.

### 9.3 Five-Template Authoring Load

Supporting five parallel project templates creates a significant authoring burden, particularly in Module 5 where each sub-lab ideally includes template-specific examples and instructions. The mitigation strategy is shared instructional scaffolding with template-specific context injection: the core instructional content is written once and shared across all templates, with template-specific variations delivered through conditional content blocks or branching paths. This approach reduces the effective authoring multiplier from 5x to approximately 1.5x–2x.

### 9.4 Local AI Awareness-Only Treatment

Some learners may want hands-on experience setting up and running local AI models, and may be disappointed that Module 6 is awareness-level only. This limitation is deliberate: hardware requirements vary widely across the target audience (from high-end workstations to basic laptops), and step-by-step setup instructions would be fragile across different operating systems and hardware configurations. A dedicated follow-up course on local AI deployment would be better positioned to provide this depth.

---

## 10. Conclusion & Future Outlook

"AI Foundations: Concept to Application" represents a comprehensive, research-grounded approach to AI literacy for non-technical learners. The course's design is informed by three established pedagogical frameworks—Bloom's Revised Taxonomy, Bruner's spiral curriculum, and the ADDIE instructional design model—and is calibrated to the specific needs and constraints of its target audience through rigorous analysis of current AI literacy research and market trends.

The metaphor-driven module names create memorable cognitive anchors that reduce the intimidation factor inherent in technical subjects. The running project spine transforms the course from a passive viewing experience into an active, cumulative building process where each new concept is immediately applied to a personally relevant artifact. The custom web and xAPI architecture ensures both a seamless, branded user experience and deep learning analytics.

Looking forward, several directions present themselves for course evolution. First, the project template library can be expanded based on learner data from the initial launch, adding templates that address emerging professional use cases. Second, industry-specific tracks—for healthcare, finance, legal, and other regulated industries—could provide domain-tailored examples, compliance considerations, and tool recommendations. Third, AI-assisted tutoring capabilities within the LMS could provide personalized guidance and feedback, particularly for the capstone project. Fourth, the course's modular, versioned architecture makes it a natural candidate for micro-credential pathways, where individual modules or module clusters could be certified as standalone competencies.

The modular, versioned architecture ensures that the course can evolve with the rapid AI landscape without requiring full re-authoring. Core conceptual content remains stable, while tool-specific details are isolated in independently refreshable components. This design balances the need for currency with the practical realities of instructional design production.

---

## 11. References

[1] Anderson, L.W. & Krathwohl, D.R. (2001). *A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives.*

[2] Zhao et al. (2024). "A Survey of Large Language Models for Education: A Survey and Outlook." *arXiv:2403.18105*. https://arxiv.org/abs/2403.18105

[3] UNESCO (2024). "AI Competency Framework for Students." https://www.unesco.org/en/articles/ai-competency-framework-students

[4] UNESCO (2024). "AI Competency Framework for Teachers." https://www.unesco.org/en/articles/ai-competency-framework-teachers

[5] Digital Education Council (2025). "AI Literacy Framework." https://www.digitaleducationcouncil.com/post/digital-education-council-ai-literacy-framework

[6] Chiu et al. (2025). "AI literacy and competency: definitions, frameworks, development." https://www.tandfonline.com/doi/full/10.1080/10494820.2025.2514372

[7] Leon Furze (2025). "Using Metaphors to Teach Critical AI Literacy." https://leonfurze.com/2025/08/28/using-metaphors-to-teach-critical-ai-literacy

[8] IBM (2025). "What is a context window?" https://www.ibm.com/think/topics/context-window

[9] Anthropic (2024). "Introducing the Model Context Protocol." https://www.anthropic.com/news/model-context-protocol

[10] Model Context Protocol Specification (2025-06-18). https://modelcontextprotocol.io/specification/2025-06-18

[11] Martin Fowler (2025). "Function calling using LLMs." https://martinfowler.com/articles/function-call-LLM.html

[12] Anthropic (2025). "Effective harnesses for long-running agents." https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

[13] Anthropic (2026). "2026 Agentic Coding Trends Report." https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf

[14] HuggingFace (2025). "Small Language Models: A Comprehensive Overview." https://huggingface.co/blog/jjokah/small-language-model

[15] Red Hat (2025). "SLMs vs LLMs." https://www.redhat.com/en/topics/ai/llm-vs-slm

[16] Pinecone (2025). "Retrieval-Augmented Generation (RAG)." https://www.pinecone.io/learn/retrieval-augmented-generation

[17] xAPI.com. "Experience API Overview." https://xapi.com/overview

[18] Articulate (2025). "What Is xAPI?" https://www.articulate.com/blog/what-is-xapi

[19] Mindsmith (2025). "SCORM vs. xAPI vs. LTI." https://www.mindsmith.ai/blog/scorm-vs-xapi-vs-lti

[20] n8n. "AI Workflow Automation Platform." https://n8n.io

[21] CrewAI. "Build. Deploy. Manage. Enterprise Agents." https://crewai.com

[22] ElevenLabs. "AI Voice Generator & Voice Agents Platform." https://elevenlabs.io

[23] HeyGen. "AI Video Generator." https://www.heygen.com

[24] eLearning Industry. "Instructional Design Using The ADDIE Model." https://elearningindustry.com/addie-model-instructional-design-using

[25] Pace University. "Bloom's Taxonomy and Learning Objectives." https://www.pace.edu/online-instructional-design/learn-tutorials-and-more/blooms-taxonomy-and-learning-objectives

[26] Oregon State University. "Bloom's Taxonomy Revisited." https://ecampus.oregonstate.edu/faculty/artificial-intelligence-tools/blooms-taxonomy-revisited

[27] Cambridge Assessment. "Perspectives on curriculum design: comparing the spiral and the network models." https://www.cambridgeassessment.org.uk/Images/598388-perspectives-on-curriculum-design-comparing-the-spiral-and-the-network-models.pdf

[28] Wikipedia. "Model Context Protocol." https://en.wikipedia.org/wiki/Model_Context_Protocol

[29] arXiv (2025). "Edge-First Language Model Inference." *arXiv:2505.16508*. https://arxiv.org/html/2505.16508v1

[30] Pinggy (2026). "Top 5 Local LLM Tools and Models." https://pinggy.io/blog/top_5_local_llm_tools_and_models
