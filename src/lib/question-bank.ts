// ============================================================================
// LIVING QUESTION BANK — "AI Foundations: Concept to Application"
// ----------------------------------------------------------------------------
// This is a living, extensible bank of knowledge-check questions organized by
// module (0–7). It supports four question types:
//   1. multiple-choice  — select exactly one correct answer
//   2. multiple-select  — select all that apply (one or more correct)
//   3. fill-blank        — type the answer; matched case-insensitively against
//                          a set of accepted answers
//   4. match-pairs       — match left items to right items (mix-and-match)
//
// The bank is consumed by:
//   - Baseline assessment (Module 0) — pre-course knowledge dipstick
//   - Per-lesson knowledge checks (inline)
//   - Final assessment (after Module 6) — post-course scoring
//
// Questions are randomized per learner and per attempt so no two assessments
// are identical. More questions can be added at any time — the bank is the
// single source of truth for all scoring in the course.
//
// All factual answers are verified against primary sources (UNESCO, IBM, arXiv,
// NIST, Pinecone, Google Cloud, HuggingFace, Red Hat, ATD). See worklog.md.
// ============================================================================

export type QuestionType = "multiple-choice" | "multiple-select" | "fill-blank" | "match-pairs";

export type Difficulty = "foundational" | "intermediate" | "advanced";

export interface BaseQuestion {
  id: string;            // stable unique id, e.g. "0-mcq-001"
  moduleId: string;      // "0".."7"
  type: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  explanation: string;   // shown after answering
  source?: string;       // citation for the correct answer
  tags?: string[];       // for future filtering
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: { id: string; text: string; correct: boolean; feedback?: string }[];
}

export interface MultipleSelectQuestion extends BaseQuestion {
  type: "multiple-select";
  options: { id: string; text: string; correct: boolean; feedback?: string }[];
  selectAllThatApply: boolean;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "fill-blank";
  acceptedAnswers: string[]; // case-insensitive, trimmed match
  placeholder: string;
  caseSensitive?: boolean;
}

export interface MatchPairsQuestion extends BaseQuestion {
  type: "match-pairs";
  pairs: { left: string; right: string }[]; // correct matching
}

export type Question =
  | MultipleChoiceQuestion
  | MultipleSelectQuestion
  | FillBlankQuestion
  | MatchPairsQuestion;

// ----------------------------------------------------------------------------
// THE BANK
// ----------------------------------------------------------------------------
// Questions are grouped by module for easy maintenance. To add or revise
// questions, edit the relevant module array below. The bank is consumed
// generically — no code changes are needed when questions are added.
// ----------------------------------------------------------------------------

import { EXTENDED_BANK_1 } from "./question-bank-extended-1";

export const QUESTION_BANK: Question[] = [
  // ========================================================================
  // MODULE 0 — ORIENTATION (AI literacy, frameworks, myths, course structure)
  // ========================================================================
  {
    id: "0-mcq-001", moduleId: "0", type: "multiple-choice", difficulty: "foundational",
    prompt: "Which organization published the AI Competency Framework for Students in 2024, structuring 12 competencies across four dimensions?",
    options: [
      { id: "a", text: "OECD", correct: false },
      { id: "b", text: "UNESCO", correct: true },
      { id: "c", text: "World Economic Forum", correct: false },
      { id: "d", text: "IEEE", correct: false }],
    explanation: "UNESCO published the AI Competency Framework for Students in August 2024, with 12 competencies across 4 dimensions: Human-centred mindset, Ethics of AI, AI techniques and applications, AI system design.",
    source: "UNESCO (2024), AI Competency Framework for Students",
    tags: ["frameworks", "literacy"],
  },
  {
    id: "0-mcq-002", moduleId: "0", type: "multiple-choice", difficulty: "foundational",
    prompt: "How many dimensions does the UNESCO AI Competency Framework for Students contain, and what are its three progression levels?",
    options: [
      { id: "a", text: "5 dimensions; Beginner → Intermediate → Expert", correct: false },
      { id: "b", text: "4 dimensions; Understand → Apply → Create", correct: true },
      { id: "c", text: "3 dimensions; Know → Do → Be", correct: false },
      { id: "d", text: "6 dimensions; Recall → Use → Evaluate", correct: false }],
    explanation: "The framework has 4 dimensions and 3 progression levels (Understand → Apply → Create), structured so learners progress from comprehension to practical use to original creation.",
    source: "UNESCO (2024)",
    tags: ["frameworks"],
  },
  {
    id: "0-msel-001", moduleId: "0", type: "multiple-select", difficulty: "intermediate",
    prompt: "Which of these are actual dimensions of the Digital Education Council (DEC) AI Literacy Framework (2025)? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Understanding AI and Data", correct: true },
      { id: "b", text: "Critical Thinking and Judgement", correct: true },
      { id: "c", text: "Ethical and Responsible AI Use", correct: true },
      { id: "d", text: "Domain Expertise", correct: true },
      { id: "e", text: "Quantum Computing Proficiency", correct: false }],
    explanation: "The DEC framework defines 5 dimensions: Understanding AI and Data; Critical Thinking and Judgement; Ethical and Responsible AI Use; Human-centricity, Emotional Intelligence & Creativity; and Domain Expertise.",
    source: "Digital Education Council (2025); Campus Technology (31 March 2025)",
    tags: ["frameworks", "literacy"],
  },
  {
    id: "0-mcq-003", moduleId: "0", type: "multiple-choice", difficulty: "intermediate",
    prompt: "According to Chiu (2025), what is the key distinction between AI literacy and AI competency?",
    options: [
      { id: "a", text: "Literacy is technical; competency is ethical.", correct: false },
      { id: "b", text: "Literacy is foundational conceptual understanding; competency is practical proficiency in real-world use.", correct: true },
      { id: "c", text: "Literacy applies to students; competency applies to teachers.", correct: false },
      { id: "d", text: "There is no meaningful distinction.", correct: false }],
    explanation: "Chiu (2025) writes: \"Literacy is the compass; competency is the engine.\" Literacy = what AI does (conceptual); competency = how to make AI work better (practical).",
    source: "Chiu (2025), DOI 10.1080/10494820.2025.2514372",
    tags: ["literacy", "competency"],
  },
  {
    id: "0-mcq-004", moduleId: "0", type: "multiple-choice", difficulty: "foundational",
    prompt: "Which statement about AI sentience is accurate?",
    options: [
      { id: "a", text: "Modern LLMs have achieved a basic form of consciousness.", correct: false },
      { id: "b", text: "AI is sentient only when the temperature parameter exceeds 1.0.", correct: false },
      { id: "c", text: "AI is not conscious; it performs statistical pattern matching, not experience.", correct: true },
      { id: "d", text: "AI becomes sentient after sufficient training data is accumulated.", correct: false }],
    explanation: "AI is not sentient. LLMs are autoregressive next-token predictors — they generate text that seems thoughtful via statistical patterns, not lived experience.",
    source: "IBM Think — Large Language Models",
    tags: ["myths"],
  },
  {
    id: "0-mcq-005", moduleId: "0", type: "multiple-choice", difficulty: "foundational",
    prompt: "The course describes AI's role in professional work as:",
    options: [
      { id: "a", text: "A complete replacement for human judgment in routine decisions.", correct: false },
      { id: "b", text: "A tool that augments human capability — producing strong first drafts a human must review.", correct: true },
      { id: "c", text: "Useful only for software engineers.", correct: false },
      { id: "d", text: "A legal liability that should be avoided in regulated industries.", correct: false }],
    explanation: "The responsible framing is augmentation, not replacement. Humans retain judgment and accountability; AI produces drafts that require human review.",
    tags: ["myths"],
  },
  {
    id: "0-fill-002", moduleId: "0", type: "fill-blank", difficulty: "intermediate",
    prompt: "According to ATD's 2025 State of the Industry report, approximately ___% of organizations expect to increase AI spending in the next fiscal year.",
    acceptedAnswers: ["75", "75%"],
    placeholder: "a number",
    explanation: "ATD's 2025 report (based on 2024 data) found 75% of organizations expect to increase AI spending next fiscal year; 55% already provide AI practical-skills training.",
    source: "ATD State of the Industry 2025 (published 15 May 2025)",
    tags: ["workplace", "atd"],
  },
  {
    id: "0-match-001", moduleId: "0", type: "match-pairs", difficulty: "intermediate",
    prompt: "Match each course module to its metaphor name.",
    pairs: [
      { left: "Module 1", right: "The Intelligence Illusion" },
      { left: "Module 2", right: "The Goldfish Problem" },
      { left: "Module 3", right: "The Toolbelt" },
      { left: "Module 4", right: "The Engine Room" },
      { left: "Module 5", right: "The Assembly Line" }],
    explanation: "The metaphor-driven names are cognitive anchors: Module 1 (Intelligence Illusion), 2 (Goldfish Problem / context limits), 3 (Toolbelt / tools), 4 (Engine Room / harnesses), 5 (Assembly Line / workflows).",
    tags: ["course-structure"],
  },
  {
    id: "0-mcq-006", moduleId: "0", type: "multiple-choice", difficulty: "intermediate",
    prompt: "What is the purpose of the running project spine in this course?",
    options: [
      { id: "a", text: "To test your programming skills across modules.", correct: false },
      { id: "b", text: "To carry a single learner-chosen artifact through every module, deepening it as new concepts are introduced.", correct: true },
      { id: "c", text: "To replace the final assessment with a portfolio review.", correct: false },
      { id: "d", text: "To group learners into teams for collaborative work.", correct: false }],
    explanation: "The running project spine is the course's running project spine: you select one of five templates in Module 0 and progressively enhance it in every subsequent module.",
    tags: ["course-structure"],
  },
  {
    id: "0-msel-002", moduleId: "0", type: "multiple-select", difficulty: "foundational",
    prompt: "Which of the following are among the five project templates you can select in this course? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "The Research Companion", correct: true },
      { id: "b", text: "The Content Engine", correct: true },
      { id: "c", text: "The Inbox/Calendar Helper", correct: true },
      { id: "d", text: "The Creative Studio", correct: true },
      { id: "e", text: "The Quantum Optimizer", correct: false }],
    explanation: "The five templates are: Research Companion, Content Engine, Inbox/Calendar Helper, Creative Studio, and Local-First Assistant.",
    tags: ["course-structure"],
  },

  // ========================================================================
  // MODULE 1 — THE INTELLIGENCE ILLUSION (AI/ML/LLM/SLM, prompts, hallucinations)
  // ========================================================================
  {
    id: "1-mcq-001", moduleId: "1", type: "multiple-choice", difficulty: "foundational",
    prompt: "Place these in correct subset order (broadest → narrowest):",
    options: [
      { id: "a", text: "ML → AI → Deep Learning → LLM", correct: false },
      { id: "b", text: "AI → ML → Deep Learning → LLM", correct: true },
      { id: "c", text: "LLM → Deep Learning → ML → AI", correct: false },
      { id: "d", text: "AI → Deep Learning → ML → LLM", correct: false }],
    explanation: "AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Language Models (LLM/SLM). Each is a subset of the one before it.",
    tags: ["hierarchy"],
  },
  {
    id: "1-mcq-002", moduleId: "1", type: "multiple-choice", difficulty: "foundational",
    prompt: "How does a large language model actually generate text?",
    options: [
      { id: "a", text: "By looking up the most matching sentence in its database.", correct: false },
      { id: "b", text: "By predicting the next token repeatedly (autoregressive next-token prediction).", correct: true },
      { id: "c", text: "By applying hand-written grammar rules.", correct: false },
      { id: "d", text: "By querying a live search engine for each response.", correct: false }],
    explanation: "LLMs are autoregressive next-token predictors built on transformer neural networks. Each token is predicted from the sequence so far; coherence emerges from statistical patterns.",
    source: "IBM Think — Large Language Models",
    tags: ["llm", "mechanism"],
  },
  {
    id: "1-mcq-003", moduleId: "1", type: "multiple-choice", difficulty: "intermediate",
    prompt: "You need an AI assistant that runs entirely offline on a sales rep's laptop for privacy. Which is the better fit?",
    options: [
      { id: "a", text: "A frontier LLM accessed via cloud API.", correct: false },
      { id: "b", text: "A quantized small language model (SLM) running locally.", correct: true },
      { id: "c", text: "Neither — you must write custom rules.", correct: false },
      { id: "d", text: "A retrieval-only search index with no neural model.", correct: false }],
    explanation: "SLMs (1M–10B parameters, quantized) are designed for offline, privacy-first, edge deployment. Cloud LLMs send data off-device and require internet.",
    source: "HuggingFace (2025); Red Hat — SLM overview",
    tags: ["slm", "deployment"],
  },
  {
    id: "1-fill-001", moduleId: "1", type: "fill-blank", difficulty: "foundational",
    prompt: "The internal weights a model adjusts during training are called ______.",
    acceptedAnswers: ["parameters", "parameter"],
    placeholder: "plural noun",
    explanation: "Parameters are the internal weights tuned during training. A modern LLM has billions of parameters — the \"knobs\" the learning process adjusts to fit data patterns.",
    tags: ["ml", "training"],
  },
  {
    id: "1-fill-002", moduleId: "1", type: "fill-blank", difficulty: "intermediate",
    prompt: "Running a trained model to produce output (e.g., every chatbot response) is called ______.",
    acceptedAnswers: ["inference"],
    placeholder: "one word",
    explanation: "Training learns the parameters; inference uses them. Every chatbot response you see is an inference step.",
    tags: ["ml", "inference"],
  },
  {
    id: "1-msel-001", moduleId: "1", type: "multiple-select", difficulty: "intermediate",
    prompt: "Which of these are compression techniques used to create small language models? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Knowledge Distillation", correct: true },
      { id: "b", text: "Pruning", correct: true },
      { id: "c", text: "Quantization", correct: true },
      { id: "d", text: "Backpropagation", correct: false },
      { id: "e", text: "Gradient clipping", correct: false }],
    explanation: "The three SLM compression techniques are Knowledge Distillation (student-teacher), Pruning (remove redundant parameters), and Quantization (reduce numerical precision). Backpropagation and gradient clipping are training techniques, not compression.",
    source: "HuggingFace blog (2025)",
    tags: ["slm", "compression"],
  },
  {
    id: "1-match-001", moduleId: "1", type: "match-pairs", difficulty: "intermediate",
    prompt: "Match each prompt component to its purpose (DAIR.AI canonical framework).",
    pairs: [
      { left: "Instruction", right: "The task to be done (summarize, draft, classify)" },
      { left: "Context", right: "Background: audience, tone, constraints" },
      { left: "Input Data", right: "The specific material to operate on" },
      { left: "Output Indicator", right: "The format/shape of the response" }],
    explanation: "DAIR.AI's canonical 4-component prompt framework: Instruction, Context, Input Data, Output Indicator. Role is often treated as part of Context.",
    source: "DAIR.AI prompt engineering guide",
    tags: ["prompting"],
  },
  {
    id: "1-mcq-004", moduleId: "1", type: "multiple-choice", difficulty: "intermediate",
    prompt: "The temperature parameter in an LLM controls:",
    options: [
      { id: "a", text: "The maximum number of tokens the model can generate.", correct: false },
      { id: "b", text: "The randomness/creativity of the output — low is deterministic, high is creative.", correct: true },
      { id: "c", text: "The training data cutoff date.", correct: false },
      { id: "d", text: "The number of GPUs used for inference.", correct: false }],
    explanation: "Low temperature (0–0.3) → deterministic, focused, good for facts. High temperature (0.7–1.0) → creative, varied, good for brainstorming.",
    tags: ["prompting", "parameters"],
  },
  {
    id: "1-mcq-005", moduleId: "1", type: "multiple-choice", difficulty: "intermediate",
    prompt: "Top-p (nucleus sampling) restricts generation to:",
    options: [
      { id: "a", text: "The single most likely token only.", correct: false },
      { id: "b", text: "Tokens whose cumulative probability exceeds p, filtering out wild long-shots.", correct: true },
      { id: "c", text: "Tokens that appeared in the training data more than p times.", correct: false },
      { id: "d", text: "The first p tokens of the prompt.", correct: false }],
    explanation: "Top-p=0.9 means the model only considers tokens that together cover 90% of the probability mass, filtering unlikely tokens while preserving diversity.",
    tags: ["prompting", "parameters"],
  },
  {
    id: "1-mcq-006", moduleId: "1", type: "multiple-choice", difficulty: "advanced",
    prompt: "An AI tells you a statistic with a specific year and a named researcher. What should you do?",
    options: [
      { id: "a", text: "Trust it — AI is usually right about specifics.", correct: false },
      { id: "b", text: "Verify the claim against a primary source before using it.", correct: true },
      { id: "c", text: "Discard the whole answer — any error means total failure.", correct: false },
      { id: "d", text: "Ask the AI to repeat it three times to confirm.", correct: false }],
    explanation: "Hallucination is inherent to next-token prediction. Specific dates, names, and statistics are the highest-risk outputs — always verify against a primary source.",
    tags: ["hallucination", "critical-thinking"],
  },
  {
    id: "1-msel-002", moduleId: "1", type: "multiple-select", difficulty: "advanced",
    prompt: "Which of these are recognized causes of AI hallucination? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Training-data gaps", correct: true },
      { id: "b", text: "Ambiguous prompts", correct: true },
      { id: "c", text: "The model's statistical tendency to continue patterns", correct: true },
      { id: "d", text: "Architectural limits of next-token prediction", correct: true },
      { id: "e", text: "Insufficient GPU clock speed", correct: false }],
    explanation: "IBM identifies training-data gaps, ambiguous prompts, statistical pattern-continuation, and architectural limits as causes. No current LLM is hallucination-free. GPU speed is unrelated.",
    source: "IBM — AI hallucinations",
    tags: ["hallucination"],
  },
  {
    id: "1-mcq-007", moduleId: "1", type: "multiple-choice", difficulty: "advanced",
    prompt: "A hiring-screening AI consistently ranks CVs with traditionally male names higher. The most likely cause is:",
    options: [
      { id: "a", text: "The model is explicitly programmed to be sexist.", correct: false },
      { id: "b", text: "Bias in the historical hiring data it learned from.", correct: true },
      { id: "c", text: "A bug in the UI rendering.", correct: false },
      { id: "d", text: "An incorrectly set temperature parameter.", correct: false }],
    explanation: "Bias is typically a data problem: the model faithfully reflects imbalanced patterns in its training corpus. Modern bias usually emerges from data, not explicit rules.",
    tags: ["bias", "ethics"],
  },
  {
    id: "1-fill-003", moduleId: "1", type: "fill-blank", difficulty: "advanced",
    prompt: "The NIST SP 1270 taxonomy catalogues bias across four families: systemic, statistical, human-cognitive, and ______.",
    acceptedAnswers: ["emergent"],
    placeholder: "one word",
    explanation: "NIST SP 1270 defines four bias families: systemic, statistical, human-cognitive, and emergent (arising from context of use).",
    source: "NIST SP 1270 — AI Risk Management Framework",
    tags: ["bias", "ethics", "nist"],
  },
  {
    id: "1-mcq-008", moduleId: "1", type: "multiple-choice", difficulty: "foundational",
    prompt: "Which best describes the relationship between AI and traditional programming?",
    options: [
      { id: "a", text: "AI replaces programming entirely.", correct: false },
      { id: "b", text: "Traditional programming uses explicit rules; ML learns patterns from examples.", correct: true },
      { id: "c", text: "They are identical approaches with different names.", correct: false },
      { id: "d", text: "AI only works for numerical data; programming handles text.", correct: false }],
    explanation: "Traditional programming: you write IF-THEN rules. Machine learning: you provide labeled examples and the system discovers patterns itself.",
    tags: ["ml", "fundamentals"],
  },
  {
    id: "1-mcq-009", moduleId: "1", type: "multiple-choice", difficulty: "intermediate",
    prompt: "The arXiv paper at ID 2402.06196 is titled \"Large Language Models: A Survey.\" Who actually authored it?",
    options: [
      { id: "a", text: "Zhao et al.", correct: false },
      { id: "b", text: "Minaee et al.", correct: true },
      { id: "c", text: "Vaswani et al.", correct: false },
      { id: "d", text: "Karpathy et al.", correct: false }],
    explanation: "arXiv:2402.06196 is Minaee et al. (2024), \"Large Language Models: A Survey.\" The Zhao-led survey is at arXiv:2303.18223. Always verify citations against the source repository.",
    source: "arXiv:2402.06196",
    tags: ["citation-hygiene", "research"],
  },

  // ========================================================================
  // MODULE 2 — THE GOLDFISH PROBLEM (context windows, tokens, RAG, chunking)
  // ========================================================================
  {
    id: "2-mcq-001", moduleId: "2", type: "multiple-choice", difficulty: "foundational",
    prompt: "What is the context window of a large language model?",
    options: [
      { id: "a", text: "The physical server room housing the model.", correct: false },
      { id: "b", text: "The amount of text (in tokens) the model can consider at any one time.", correct: true },
      { id: "c", text: "The time period covered by the training data.", correct: false },
      { id: "d", text: "The UI element showing the user's conversation history.", correct: false }],
    explanation: "The context window is the amount of text, measured in tokens, that a model can \"hold in mind\" at once. Everything the model considers in a single turn must fit inside it.",
    source: "IBM Think — context windows",
    tags: ["context-window"],
  },
  {
    id: "2-fill-001", moduleId: "2", type: "fill-blank", difficulty: "foundational",
    prompt: "The subword units that LLMs read and write are called ______.",
    acceptedAnswers: ["tokens", "token"],
    placeholder: "plural noun",
    explanation: "Tokens are subword units — between a whole word and a single character. Pricing, context limits, and output length are all measured in tokens.",
    tags: ["tokens"],
  },
  {
    id: "2-mcq-002", moduleId: "2", type: "multiple-choice", difficulty: "foundational",
    tags: ["tokens"],
    prompt: "A 1,000-word English document will most likely consume approximately:",
    options: [
      { id: "a", text: "1,000 tokens (1:1 with words).", correct: false },
      { id: "b", text: "~1,300 tokens.", correct: true },
      { id: "c", text: "~500 tokens.", correct: false },
      { id: "d", text: "~10,000 tokens.", correct: false }],
    explanation: "English text averages ~1.3 tokens per word because common words are one token but longer/uncommon words split into multiple subword tokens (~4 characters per token).",
    source: "Hugging Face — Tokenizer Summary",
    tags: ["tokens", "estimation"],
  },
  {
    id: "2-msel-001", moduleId: "2", type: "multiple-select", difficulty: "intermediate",
    prompt: "Which of these are common tokenization algorithms? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Byte-Pair Encoding (BPE)", correct: true },
      { id: "b", text: "WordPiece", correct: true },
      { id: "c", text: "SentencePiece / Unigram", correct: true },
      { id: "d", text: "QuickSort", correct: false },
      { id: "e", text: "Dijkstra's algorithm", correct: false }],
    explanation: "BPE (GPT family), WordPiece (BERT), and SentencePiece/Unigram (many multilingual models) are subword tokenizers. QuickSort and Dijkstra are general algorithms unrelated to tokenization.",
    source: "arXiv:2411.17669 — comparative analysis",
    tags: ["tokens", "tokenization"],
  },
  {
    id: "2-match-001", moduleId: "2", type: "match-pairs", difficulty: "intermediate",
    prompt: "Match each model to its advertised context window size.",
    pairs: [
      { left: "GPT-3.5 (original ChatGPT)", right: "4,096 tokens" },
      { left: "GPT-4o / o1", right: "128,000 tokens" },
      { left: "Claude 3.5 Sonnet", right: "~200,000 tokens" },
      { left: "Gemini 1.5 Pro", right: "2,000,000 tokens" }],
    explanation: "Context windows span 4 orders of magnitude: GPT-3.5 (4K) → GPT-4o (128K) → Claude 3.5 (200K) → Gemini 1.5 Pro (2M). Current frontier models advertise up to 10M.",
    source: "IBM Think (Oct 2024); Elvex (2025–2026)",
    },
  {
    id: "2-mcq-003", moduleId: "2", type: "multiple-choice", difficulty: "advanced",
    tags: ["lost-in-middle"],
    prompt: "You need to ask an AI about a specific clause buried in the middle of a 100-page contract. Based on the \"Lost in the Middle\" finding, what should you do?",
    options: [
      { id: "a", text: "Paste the whole contract; the AI will find it.", correct: false },
      { id: "b", text: "Extract the relevant section and place it at the start or end of the prompt.", correct: true },
      { id: "c", text: "Repeat the question three times in the middle.", correct: false },
      { id: "d", text: "Increase the temperature to 1.0 for better attention.", correct: false }],
    explanation: "Liu et al. (2023) showed models attend least to the middle of long contexts. Place critical content at the start or end of the prompt.",
    source: "Liu et al. (2023), arXiv:2307.03172 — \"Lost in the Middle\"",
    tags: ["lost-in-middle", "prompting"],
  },
  {
    id: "2-mcq-004", moduleId: "2", type: "multiple-choice", difficulty: "intermediate",
    tags: ["context-window-cost"],
    prompt: "How does compute cost scale with input sequence length in transformer models?",
    options: [
      { id: "a", text: "Linearly (double tokens = double cost).", correct: false },
      { id: "b", text: "Quadratically (double tokens ≈ 4× processing power).", correct: true },
      { id: "c", text: "Logarithmically.", correct: false },
      { id: "d", text: "Cost is constant regardless of length.", correct: false }],
    explanation: "Transformer attention is O(n²) — compute cost scales roughly quadratically with sequence length. Doubling input tokens takes about 4× the processing power.",
    source: "IBM Think — context windows",
    tags: ["context-window", "cost"],
  },
  {
    id: "2-mcq-005", moduleId: "2", type: "multiple-choice", difficulty: "foundational",
    tags: ["rag"],
    prompt: "In Retrieval-Augmented Generation (RAG), which component produces the final answer the user sees?",
    options: [
      { id: "a", text: "The retriever.", correct: false },
      { id: "b", text: "The generator (the LLM).", correct: true },
      { id: "c", text: "The vector database.", correct: false },
      { id: "d", text: "The embedding model.", correct: false }],
    explanation: "RAG = Retriever (finds relevant info) + Generator (the LLM, which writes the answer using the retrieved context). The LLM is the generator.",
    source: "Pinecone — RAG overview; Google Cloud — RAG",
    tags: ["rag"],
  },
  {
    id: "2-match-002", moduleId: "2", type: "match-pairs", difficulty: "intermediate",
    prompt: "Match each RAG stage to what it does.",
    pairs: [
      { left: "Ingestion", right: "Documents are chunked, embedded, and stored in a vector DB" },
      { left: "Retrieval", right: "Relevant chunks are fetched based on the user query" },
      { left: "Augmentation", right: "Retrieved chunks + query are combined into a prompt" },
      { left: "Generation", right: "The LLM produces a grounded answer" }],
    explanation: "RAG has 4 stages: Ingestion → Retrieval → Augmentation → Generation. This separates knowledge (in the DB) from reasoning (in the model).",
    source: "Pinecone — RAG overview",
    tags: ["rag", "architecture"],
  },
  {
    id: "2-fill-002", moduleId: "2", type: "fill-blank", difficulty: "advanced",
    prompt: "A numerical vector representation of text that captures semantic meaning is called an ______.",
    acceptedAnswers: ["embedding"],
    placeholder: "one word",
    explanation: "An embedding is a numerical vector representation of text capturing semantic meaning. Texts with similar meanings have vectors close together in space.",
    },
  {
    id: "2-mcq-006", moduleId: "2", type: "multiple-choice", difficulty: "advanced",
    prompt: "Why is RAG often preferred over fine-tuning a model on company data?",
    options: [
      { id: "a", text: "Fine-tuning is illegal for commercial use.", correct: false },
      { id: "b", text: "RAG is more cost-effective, keeps data updatable without retraining, and provides source citations.", correct: true },
      { id: "c", text: "RAG produces longer answers.", correct: false },
      { id: "d", text: "Fine-tuning requires a PhD.", correct: false }],
    explanation: "RAG lets you update the knowledge base without retraining, controls which sources are used, and grounds answers in citations — at a fraction of fine-tuning's cost.",
    tags: ["rag", "fine-tuning"],
  },
  {
    id: "2-msel-002", moduleId: "2", type: "multiple-select", difficulty: "advanced",
    prompt: "Which of these are common chunking strategies for RAG? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Fixed-size chunking", correct: true },
      { id: "b", text: "Sliding-window chunking (with overlap)", correct: true },
      { id: "c", text: "Sentence-based chunking", correct: true },
      { id: "d", text: "Semantic chunking (using embeddings)", correct: true },
      { id: "e", text: "Random shuffling", correct: false }],
    explanation: "Common strategies: fixed-size, sliding-window, sentence-based, semantic, and document-structure chunking. Random shuffling destroys semantic coherence.",
    source: "Pinecone Learn — Chunking Strategies (2025)",
    tags: ["rag", "chunking"],
  },
  {
    id: "2-mcq-007", moduleId: "2", type: "multiple-choice", difficulty: "advanced",
    prompt: "You're building RAG over legal contracts where clause boundaries matter. Which chunking strategy is most appropriate?",
    options: [
      { id: "a", text: "Fixed-size, 256 tokens, no overlap.", correct: false },
      { id: "b", text: "Document-structure chunking (split by clause/section headings).", correct: true },
      { id: "c", text: "One chunk per entire contract.", correct: false },
      { id: "d", text: "Random character sampling.", correct: false }],
    explanation: "For documents with meaningful structure (contracts, policies, manuals), document-structure chunking preserves the semantic units the retriever needs.",
    tags: ["rag", "chunking", "application"],
  },
  {
    id: "2-fill-003", moduleId: "2", type: "fill-blank", difficulty: "intermediate",
    prompt: "The phenomenon where LLMs pay less attention to information in the middle of long contexts is called \"Lost in the ______\".",
    acceptedAnswers: ["Middle", "middle"],
    placeholder: "one word",
    explanation: "\"Lost in the Middle\" (Liu et al., 2023, arXiv:2307.03172): performance is highest when relevant info is at the beginning or end of the context, and degrades in the middle.",
    source: "Liu et al. (2023), TACL",
    tags: ["lost-in-middle"],
  },

  // ========================================================================
  // MODULES 3–7 — representative foundational questions (bank will grow)
  // These modules are coming-soon; questions here seed the final assessment.
  // ========================================================================
  // --- Module 3: The Toolbelt (tool calling, MCP) ---
  {
    id: "3-mcq-001", moduleId: "3", type: "multiple-choice", difficulty: "intermediate",
    prompt: "In function/tool calling with an LLM, which statement is accurate?",
    options: [
      { id: "a", text: "The LLM both identifies the function to call and executes it.", correct: false },
      { id: "b", text: "The LLM identifies the function and specifies parameters in JSON; a separate runtime executes it.", correct: true },
      { id: "c", text: "The LLM can only call functions it was trained on.", correct: false },
      { id: "d", text: "Tool calling requires fine-tuning the model.", correct: false }],
    explanation: "The LLM identifies that a function should be called and specifies the parameters in structured JSON, but does NOT execute the function itself. A separate runtime component performs execution — critical for safety and control.",
    source: "Martin Fowler (2025) — function calling; Anthropic",
    tags: ["tool-calling", "mcp"],
  },
  {
    id: "3-mcq-002", moduleId: "3", type: "multiple-choice", difficulty: "intermediate",
    prompt: "What is the Model Context Protocol (MCP)?",
    options: [
      { id: "a", text: "A proprietary Anthropic model.", correct: false },
      { id: "b", text: "An open standard (introduced by Anthropic, Nov 2024) for AI systems to connect with external data sources and tools in a standardized way.", correct: true },
      { id: "c", text: "A replacement for the HTTP protocol.", correct: false },
      { id: "d", text: "A training dataset for small language models.", correct: false }],
    explanation: "MCP is an open standard introduced by Anthropic in November 2024 that enables AI systems to connect with external data sources and tools in a standardized way — like a \"universal plug adapter.\"",
    source: "Anthropic (2024); MCP Specification 2025-06-18",
    tags: ["mcp", "tools"],
  },
  {
    id: "3-fill-001", moduleId: "3", type: "fill-blank", difficulty: "foundational",
    prompt: "Without tools, an LLM can only generate ______. With tools, it can search the web, query databases, and take action.",
    acceptedAnswers: ["text"],
    placeholder: "one word",
    explanation: "Without tools, an LLM can only generate text. Tools extend its capabilities to web search, database queries, API calls, code execution, image generation, and more.",
    tags: ["tools"],
  },
  {
    id: "3-msel-001", moduleId: "3", type: "multiple-select", difficulty: "advanced",
    prompt: "Which of these are examples of capabilities tools can give an LLM? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Web search", correct: true },
      { id: "b", text: "File system access", correct: true },
      { id: "c", text: "Code execution", correct: true },
      { id: "d", text: "Image generation", correct: true },
      { id: "e", text: "Human consciousness", correct: false }],
    explanation: "Tools extend LLMs with web search, file access, API calls, code execution, image generation, email integration, and more. Consciousness is not a tool capability.",
    tags: ["tools", "capabilities"],
  },
  {
    id: "3-mcq-003", moduleId: "3", type: "multiple-choice", difficulty: "foundational",
    prompt: "When an LLM uses a tool to search the web, why is this valuable?",
    options: [
      { id: "a", text: "It allows the LLM to access information that is more recent than its training data cutoff.", correct: true },
      { id: "b", text: "It prevents the LLM from hallucinating entirely.", correct: false },
      { id: "c", text: "It makes the LLM run faster.", correct: false },
      { id: "d", text: "It automatically verifies the truthfulness of any website it visits.", correct: false }],
    explanation: "Web search allows the LLM to pull in live facts and information that occurred after its training data cutoff, reducing hallucinations caused by outdated data (though not eliminating hallucinations entirely).",
    tags: ["tools", "capabilities"],
  },

  // --- Module 4: The Engine Room (harnesses, agents) ---
  {
    id: "4-mcq-001", moduleId: "4", type: "multiple-choice", difficulty: "intermediate",
    prompt: "What is the critical distinction between an AI \"harness\" and the underlying model?",
    options: [
      { id: "a", text: "The harness is the model's training data; the model is the inference engine.", correct: false },
      { id: "b", text: "The harness is the orchestration layer that controls how the model is used (tools, memory, guardrails); the model is the raw text generator.", correct: true },
      { id: "c", text: "They are the same thing.", correct: false },
      { id: "d", text: "The harness is hardware; the model is software.", correct: false }],
    explanation: "A raw LLM is powerful but unsafe without a transmission, steering, and brakes. The harness is the orchestration layer that manages behavior, connects tools, maintains memory, and enforces guardrails.",
    source: "Anthropic — Effective Harnesses for Long-Running Agents",
    tags: ["harness", "agents"],
  },
  {
    id: "4-mcq-002", moduleId: "4", type: "multiple-choice", difficulty: "advanced",
    prompt: "What is the agent loop?",
    options: [
      { id: "a", text: "Train → Validate → Test → Deploy.", correct: false },
      { id: "b", text: "Plan → Act → Observe → Iterate.", correct: true },
      { id: "c", text: "Read → Write → Read → Write.", correct: false },
      { id: "d", text: "Prompt → Response → Prompt → Response.", correct: false }],
    explanation: "An agent plans a sequence of actions, executes them using tools, observes the results, and iterates. The plan-act-observe-iterate loop is the core of agent architecture.",
    tags: ["agents", "architecture"],
  },
  {
    id: "4-match-001", moduleId: "4", type: "match-pairs", difficulty: "advanced",
    prompt: "Match each memory system to its scope in an agent.",
    pairs: [
      { left: "Context memory", right: "Current conversation" },
      { left: "Trajectory memory", right: "History of actions taken" },
      { left: "Persistent memory", right: "Long-term storage across sessions" }],
    explanation: "Agents use three memory systems: context (current conversation), trajectory (action history within a task), and persistent (long-term, cross-session).",
    tags: ["agents", "memory"],
  },
  {
    id: "4-fill-001", moduleId: "4", type: "fill-blank", difficulty: "intermediate",
    prompt: "A checkpoint where a human reviews and approves an agent's action before it proceeds is called ______-in-the-loop.",
    acceptedAnswers: ["human", "Human"],
    placeholder: "one word",
    explanation: "Human-in-the-loop (HITL) checkpoints are a critical guardrail: a human reviews and approves an agent's action before execution, especially for high-stakes decisions.",
    tags: ["agents", "guardrails"],
  },
  {
    id: "4-mcq-003", moduleId: "4", type: "multiple-choice", difficulty: "foundational",
    prompt: "What is a 'cascade failure' in the context of an AI agent?",
    options: [
      { id: "a", text: "When an agent fails to call a tool because the API is down.", correct: false },
      { id: "b", text: "When an early error in a multi-step process propagates and causes all subsequent steps to fail.", correct: true },
      { id: "c", text: "When the agent runs out of tokens in its context window.", correct: false },
      { id: "d", text: "When the model's weights degrade over time.", correct: false }],
    explanation: "A cascade failure occurs when one error early in the chain propagates through the entire workflow, compounding the mistake at each step.",
    tags: ["agents", "failure-modes"],
  },

  // --- Module 5: The Assembly Line (workflows) ---
  {
    id: "5-mcq-001", moduleId: "5", type: "multiple-choice", difficulty: "intermediate",
    prompt: "What does an AI workflow do, by analogy to its namesake?",
    options: [
      { id: "a", text: "It trains models on an assembly line of GPUs.", correct: false },
      { id: "b", text: "It passes a raw input through a sequence of AI-powered steps (ideation, drafting, critique, revision) until a polished output emerges.", correct: true },
      { id: "c", text: "It assembles multiple AI models into a single large model.", correct: false },
      { id: "d", text: "It manufactures hardware accelerators.", correct: false }],
    explanation: "Like a manufacturing assembly line, an AI workflow takes raw input and transforms it through a sequence of stations (ideation → draft → critique → revision) until a finished product emerges.",
    tags: ["workflows"],
  },
  {
    id: "5-mcq-002", moduleId: "5", type: "multiple-choice", difficulty: "advanced",
    prompt: "Module 5 has three sub-labs. Which domain is NOT one of them?",
    options: [
      { id: "a", text: "Content", correct: false },
      { id: "b", text: "Coding", correct: false },
      { id: "c", text: "Media", correct: false },
      { id: "d", text: "Hardware manufacturing", correct: true }],
    explanation: "The three sub-labs are Content (ideation→draft→critique→revision), Coding (spec→generation→testing→iteration), and Media (script→generation→review→publication).",
    tags: ["workflows", "course-structure"],
  },
  {
    id: "5-fill-001", moduleId: "5", type: "fill-blank", difficulty: "intermediate",
    prompt: "n8n, Zapier, and Make are examples of ______-code workflow automation platforms.",
    acceptedAnswers: ["low", "no", "no/low", "no-code", "low-code"],
    placeholder: "no or low",
    explanation: "n8n (visual/low-code), Zapier, and Make are no-code/low-code workflow automation platforms that let non-technical users build multi-step AI workflows.",
    tags: ["workflows", "tools"],
  },


  // --- Module 6: The Horizon (staying current, capstone) ---
  {
    id: "6-mcq-001", moduleId: "6", type: "multiple-choice", difficulty: "foundational",
    prompt: "What is the recommended refresh cadence for the Tool Landscape resource (the curated, versioned list of AI tools)?",
    options: [
      { id: "a", text: "Daily.", correct: false },
      { id: "b", text: "Quarterly.", correct: true },
      { id: "c", text: "Once, at course launch.", correct: false },
      { id: "d", text: "Never — tools never change.", correct: false }],
    explanation: "A quarterly refresh cycle is recommended for the Tool Landscape, given the rate of tool-market churn. Core SCORM content is reviewed semi-annually; full course revisions annually.",
    tags: ["refresh", "tool-landscape"],
  },
  {
    id: "6-mcq-002", moduleId: "6", type: "multiple-choice", difficulty: "intermediate",
    prompt: "The Module 6 capstone is evaluated against a four-dimension rubric. Which dimension carries the highest weight?",
    options: [
      { id: "a", text: "Technical Functionality (30%).", correct: true },
      { id: "b", text: "Workflow Complexity (25%).", correct: false },
      { id: "c", text: "Critical Evaluation (25%).", correct: false },
      { id: "d", text: "Presentation Quality (20%).", correct: false }],
    explanation: "The capstone rubric: Technical Functionality 30%, Workflow Complexity 25%, Critical Evaluation 25%, Presentation Quality 20%.",
    tags: ["capstone", "rubric"],
  },
  {
    id: "6-match-001", moduleId: "6", type: "match-pairs", difficulty: "intermediate",
    prompt: "Match each capstone rubric dimension to its weight.",
    pairs: [
      { left: "Technical Functionality", right: "30%" },
      { left: "Workflow Complexity", right: "25%" },
      { left: "Critical Evaluation", right: "25%" },
      { left: "Presentation Quality", right: "20%" }],
    explanation: "The four-dimension capstone rubric assesses both technical understanding and critical thinking, weighted 30/25/25/20.",
    tags: ["capstone", "rubric"],
  },
  {
    id: "6-fill-001", moduleId: "6", type: "fill-blank", difficulty: "foundational",
    prompt: "The course separates durable conceptual content from perishable tool-specific content using versioned ______ Notes one-pagers in Module 5.",
    acceptedAnswers: ["Field", "field"],
    placeholder: "one word",
    explanation: "Field Notes one-pagers are versioned separately from the core SCORM content, allowing tool-specific information to be updated without republishing the entire course.",
    tags: ["versioning", "field-notes"],
  },
  {
    id: "6-mcq-003", moduleId: "6", type: "multiple-choice", difficulty: "advanced",
    prompt: "Why does the course separate durable conceptual content from perishable tool-specific content?",
    options: [
      { id: "a", text: "To reduce the total number of lessons.", correct: false },
      { id: "b", text: "So tool-specific updates don't require full course republication — concepts stay stable while tools refresh quarterly.", correct: true },
      { id: "c", text: "Because tools are illegal to teach.", correct: false },
      { id: "d", text: "To force learners to buy separate tool licenses.", correct: false }],
    explanation: "This is the course's most important architectural decision: separating the durable (concepts) from the perishable (tools) positions the course for long-term relevance in a fast-moving field.",
    tags: ["versioning", "architecture"],
  },
  // ========================================================================
  // MODULE 3 — Additional questions (tool calling, MCP)
  // ========================================================================
  {
    id: "3-mcq-003", moduleId: "3", type: "multiple-choice", difficulty: "foundational",
    prompt: "Without tools, an LLM can only:",
    options: [
      { id: "a", text: "Execute code", correct: false },
      { id: "b", text: "Generate text", correct: true },
      { id: "c", text: "Send emails", correct: false },
      { id: "d", text: "Query databases", correct: false },
    ],
    explanation: "Without tools, an LLM can only generate text. Tools extend its capabilities to web search, database queries, code execution, image generation, and more.",
    tags: ["tools"],
  },
  {
    id: "3-fill-002", moduleId: "3", type: "fill-blank", difficulty: "intermediate",
    prompt: "The model's tool-call response is structured as ______, not prose — this determinism lets the runtime parse it safely.",
    acceptedAnswers: ["JSON"],
    placeholder: "a data format",
    explanation: "The tool-call response is structured JSON, not free text. This determinism is what lets the runtime parse and execute it safely.",
    tags: ["function-calling", "json"],
  },
  {
    id: "3-match-002", moduleId: "3", type: "match-pairs", difficulty: "intermediate",
    prompt: "Match each MCP component to its role.",
    pairs: [
      { left: "MCP Host", right: "The AI application (e.g., Claude Desktop)" },
      { left: "MCP Client", right: "Manages connections to MCP servers inside the host" },
      { left: "MCP Server", right: "Exposes specific tools using the MCP protocol" },
    ],
    explanation: "Host (AI app) → Client (connection manager) → Server (tool provider). The host initiates; the server exposes tools.",
    tags: ["mcp", "architecture"],
  },
  {
    id: "3-mcq-004", moduleId: "3", type: "multiple-choice", difficulty: "advanced",
    prompt: "Why is it important that the LLM does NOT execute the function itself in function calling?",
    options: [
      { id: "a", text: "Because LLMs are too slow to execute functions.", correct: false },
      { id: "b", text: "Because the separation lets the runtime enforce permissions, validate inputs, and require human approval — impossible if the model runs wild.", correct: true },
      { id: "c", text: "Because function execution requires a GPU.", correct: false },
      { id: "d", text: "Because the LLM would refuse to execute.", correct: false },
    ],
    explanation: "The separation of concerns (model decides, runtime executes) is the critical safety property. It enables permission control, validation, logging, and human-in-the-loop.",
    tags: ["function-calling", "safety"],
  },
  {
    id: "3-msel-002", moduleId: "3", type: "multiple-select", difficulty: "intermediate",
    prompt: "Which of these are MCP-supported programming languages? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "TypeScript", correct: true },
      { id: "b", text: "Python", correct: true },
      { id: "c", text: "Rust", correct: true },
      { id: "d", text: "Swift", correct: true },
      { id: "e", text: "Latin", correct: false },
    ],
    explanation: "MCP SDKs support TypeScript, Python, Java, Kotlin, C#, Go, PHP, Ruby, Rust, and Swift — so developers can build MCP servers in their tool's language.",
    source: "MCP Specification (2025-06-18)",
    tags: ["mcp", "languages"],
  },

  // ========================================================================
  // MODULE 4 — Additional questions (harnesses, agents, guardrails)
  // ========================================================================
  {
    id: "4-mcq-003", moduleId: "4", type: "multiple-choice", difficulty: "foundational",
    prompt: "Which is NOT a function of an AI harness?",
    options: [
      { id: "a", text: "Managing context (what the model sees each turn)", correct: false },
      { id: "b", text: "Connecting tools and routing tool-call requests", correct: false },
      { id: "c", text: "Training the model from scratch on new data", correct: true },
      { id: "d", text: "Enforcing guardrails (permissions, validation)", correct: false },
    ],
    explanation: "The harness manages context, tools, memory, and guardrails. It does NOT train the model — training is a separate process. The harness uses a pre-trained model.",
    tags: ["harness"],
  },
  {
    id: "4-fill-002", moduleId: "4", type: "fill-blank", difficulty: "intermediate",
    prompt: "The technique of summarizing older context to free up context window space without losing key information is called ______.",
    acceptedAnswers: ["compaction"],
    placeholder: "one word",
    explanation: "Compaction (highlighted in Anthropic's harness research) summarizes older context so agents can work on tasks that exceed the context window.",
    source: "Anthropic — Effective Harnesses for Long-Running Agents",
    tags: ["harness", "compaction"],
  },
  {
    id: "4-msel-001", moduleId: "4", type: "multiple-select", difficulty: "advanced",
    prompt: "Which of these are types of guardrails for agents? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Permission management", correct: true },
      { id: "b", text: "Output validation", correct: true },
      { id: "c", text: "Human-in-the-loop checkpoints", correct: true },
      { id: "d", text: "Failure recovery", correct: true },
      { id: "e", text: "Faster GPU clock speed", correct: false },
    ],
    explanation: "The four guardrail types: permission management, output validation, human-in-the-loop checkpoints, and failure recovery. GPU speed is unrelated.",
    tags: ["guardrails", "agents"],
  },
  {
    id: "4-mcq-004", moduleId: "4", type: "multiple-choice", difficulty: "intermediate",
    prompt: "Which multi-agent framework is known for role-based 'crew members'?",
    options: [
      { id: "a", text: "LangGraph", correct: false },
      { id: "b", text: "CrewAI", correct: true },
      { id: "c", text: "AutoGen", correct: false },
      { id: "d", text: "TensorFlow", correct: false },
    ],
    explanation: "CrewAI uses role-based agents ('crew members') and is intuitive for defining agent teams. LangGraph is graph-based; AutoGen is conversation-driven.",
    tags: ["multi-agent", "frameworks"],
  },

  // ========================================================================
  // MODULE 5 — Additional questions (workflows)
  // ========================================================================
  {
    id: "5-mcq-003", moduleId: "5", type: "multiple-choice", difficulty: "foundational",
    prompt: "What is the core idea of the assembly-line metaphor applied to AI?",
    options: [
      { id: "a", text: "Training multiple models in parallel.", correct: false },
      { id: "b", text: "Passing a raw input through a sequence of AI-powered stations, each adding value, until a polished output emerges.", correct: true },
      { id: "c", text: "Using AI to manufacture physical products.", correct: false },
      { id: "d", text: "Connecting multiple GPUs in a pipeline.", correct: false },
    ],
    explanation: "An AI workflow passes raw input through stations (ideation, drafting, critique, revision) — like an assembly line where each station adds one transformation.",
    tags: ["workflows"],
  },
  {
    id: "5-match-001", moduleId: "5", type: "match-pairs", difficulty: "intermediate",
    prompt: "Match each sub-lab to its workflow loop.",
    pairs: [
      { left: "Content Sub-Lab", right: "Ideation → Draft → Critique → Revision" },
      { left: "Coding Sub-Lab", right: "Spec → Generate → Test → Iterate" },
      { left: "Media Sub-Lab", right: "Script → Generate → Review → Publish" },
    ],
    explanation: "Each sub-lab follows a four-station loop specialized for its domain: content (write), coding (build), media (produce).",
    tags: ["workflows", "sub-labs"],
  },
  {
    id: "5-fill-002", moduleId: "5", type: "fill-blank", difficulty: "intermediate",
    prompt: "In a multi-step workflow, errors ______ — a bad idea becomes a bad draft becomes a polished bad output. Early checkpoints are cheaper than late ones.",
    acceptedAnswers: ["compound"],
    placeholder: "one word",
    explanation: "Errors compound across stations. That's why early checkpoints (after ideation, after drafting) are cheaper than late ones — catch problems where they originate.",
    tags: ["workflows", "checkpoints"],
  },
  {
    id: "5-mcq-004", moduleId: "5", type: "multiple-choice", difficulty: "advanced",
    prompt: "Why chain multiple AI steps instead of using one big prompt?",
    options: [
      { id: "a", text: "One big prompt is always faster.", correct: false },
      { id: "b", text: "Chaining lets you control each transformation, insert quality checkpoints, and iterate on weak spots — the whole is better than the sum of its parts.", correct: true },
      { id: "c", text: "Chaining is required by SCORM.", correct: false },
      { id: "d", text: "One big prompt always produces better output.", correct: false },
    ],
    explanation: "A single prompt asking for 'a great blog post' produces generic output. Breaking it into stations gives control, checkpoints, and iteration — producing better results.",
    tags: ["workflows", "design"],
  },


  // ========================================================================
  // MODULE 7 — Additional questions (staying current, capstone)
  // ========================================================================
  {
    id: "6-mcq-004", moduleId: "6", type: "multiple-choice", difficulty: "foundational",
    prompt: "What is the recommended refresh cadence for the Tool Landscape resource?",
    options: [
      { id: "a", text: "Daily", correct: false },
      { id: "b", text: "Quarterly", correct: true },
      { id: "c", text: "Once at launch", correct: false },
      { id: "d", text: "Never", correct: false },
    ],
    explanation: "A quarterly refresh cycle is recommended for the Tool Landscape given the rate of tool-market churn. Core conceptual content is reviewed semi-annually.",
    tags: ["tool-landscape", "refresh"],
  },
  {
    id: "6-match-002", moduleId: "6", type: "match-pairs", difficulty: "intermediate",
    prompt: "Match each capstone rubric dimension to its weight.",
    pairs: [
      { left: "Technical Functionality", right: "30%" },
      { left: "Workflow Complexity", right: "25%" },
      { left: "Critical Evaluation", right: "25%" },
      { left: "Presentation Quality", right: "20%" },
    ],
    explanation: "The four-dimension rubric: Technical Functionality 30%, Workflow Complexity 25%, Critical Evaluation 25%, Presentation Quality 20%.",
    tags: ["capstone", "rubric"],
  },
  {
    id: "6-msel-001", moduleId: "6", type: "multiple-select", difficulty: "intermediate",
    prompt: "Which of these are sustainable habits for staying current in AI? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Subscribe to 2–3 high-signal newsletters", correct: true },
      { id: "b", text: "Follow a handful of trusted thought leaders", correct: true },
      { id: "c", text: "Set aside weekly time for hands-on experimentation", correct: true },
      { id: "d", text: "Subscribe to every AI newsletter you can find", correct: false },
      { id: "e", text: "Never experiment — just read about tools", correct: false },
    ],
    explanation: "Sustainable habits: curate ruthlessly (2–3 newsletters, not 20), follow trusted voices, join one community, and experiment weekly. Information overload is the trap to avoid.",
    tags: ["staying-current", "habits"],
  },
  {
    id: "6-fill-002", moduleId: "6", type: "fill-blank", difficulty: "advanced",
    prompt: "The course separates durable conceptual content from perishable tool-specific content using versioned ______ Notes one-pagers in Module 5.",
    acceptedAnswers: ["Field", "field"],
    placeholder: "one word",
    explanation: "Field Notes one-pagers are versioned separately from core SCORM content, allowing tool-specific updates without republishing the entire course.",
    tags: ["versioning", "field-notes"],
  },
  {
    id: "6-mcq-005", moduleId: "6", type: "multiple-choice", difficulty: "advanced",
    prompt: "Why does Critical Evaluation weigh as much as Workflow Complexity in the capstone rubric (25% each)?",
    options: [
      { id: "a", text: "Because the rubric designer made an error.", correct: false },
      { id: "b", text: "Because as AI tools become more capable, the ability to judge when NOT to use them becomes the scarce skill.", correct: true },
      { id: "c", text: "Because critical evaluation is easier than building workflows.", correct: false },
      { id: "d", text: "Because presentation quality matters less.", correct: false },
    ],
    explanation: "Research in AI-enabled rubric design emphasizes assessing not just technical output but the learner's ability to critically evaluate it. As tools get more capable, judgment becomes the scarce skill.",
    tags: ["capstone", "rubric", "critical-evaluation"],
  },
  // --- MODULE 6 QUESTIONS ---
  {
    id: "m6-1",
    type: "multiple-choice",
    question: "What is the primary privacy advantage of running a Small Language Model (SLM) locally?",
    options: [
      { id: "a", text: "The model uses end-to-end encryption to communicate with the cloud.", correct: false },
      { id: "b", text: "Sensitive data never leaves your device's physical memory.", correct: true },
      { id: "c", text: "The cloud provider signs a stricter NDA.", correct: false },
      { id: "d", text: "Local models automatically redact PII before sending data.", correct: false }
    ],
    explanation: "Local execution means the inference happens entirely on your own hardware, guaranteeing absolute privacy as no network requests are made.",
    tags: ["module-6", "privacy"]
  },
  {
    id: "m6-2",
    type: "multiple-choice",
    question: "Which technique involves shrinking an LLM by training it to mimic the outputs of a larger, more complex model?",
    options: [
      { id: "a", text: "Quantization", correct: false },
      { id: "b", text: "Knowledge Distillation", correct: true },
      { id: "c", text: "Retrieval Augmented Generation", correct: false },
      { id: "d", text: "Fine-tuning", correct: false }
    ],
    explanation: "Knowledge distillation is the process where a smaller 'student' model is trained to replicate the behavior and outputs of a larger 'teacher' model.",
    tags: ["module-6", "distillation"]
  },
  {
    id: "m6-3",
    type: "multiple-choice",
    question: "How does Quantization make AI models run faster on consumer hardware?",
    options: [
      { id: "a", text: "By removing layers from the neural network.", correct: false },
      { id: "b", text: "By reducing the precision of the model's weights (e.g. from 32-bit to 4-bit integers).", correct: true },
      { id: "c", text: "By sending the heavy computation to a local server.", correct: false },
      { id: "d", text: "By caching previous answers to avoid recalculation.", correct: false }
    ],
    explanation: "Quantization shrinks the memory footprint by storing the neural network's weights in lower precision formats, allowing it to fit into VRAM and run significantly faster.",
    tags: ["module-6", "quantization"]
  },
  {
    id: "m6-4",
    type: "multiple-select",
    question: "Which of the following are primary motivations for deploying an AI agent locally rather than using a cloud API? (Select all that apply)",
    options: [
      { id: "a", text: "Eliminating per-token API costs", correct: true },
      { id: "b", text: "Achieving higher reasoning capabilities than GPT-4", correct: false },
      { id: "c", text: "Guaranteeing offline availability", correct: true },
      { id: "d", text: "Ensuring sensitive proprietary data remains on-premise", correct: true }
    ],
    explanation: "Local AI eliminates recurring API costs, works without an internet connection, and ensures absolute data privacy. However, SLMs currently cannot match the sheer reasoning capabilities of massive cloud models like GPT-4.",
    tags: ["module-6", "deployment"]
  },
  ...EXTENDED_BANK_1
];

// ----------------------------------------------------------------------------
// HELPERS — randomization & selection
// ----------------------------------------------------------------------------

/** Fisher-Yates shuffle (returns a new array, does not mutate input). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Get all questions for a given module. */
export function questionsForModule(moduleId: string): Question[] {
  return QUESTION_BANK.filter((q) => q.moduleId === moduleId);
}

/** Count questions per module (for the dashboard stat). */
export function questionCountByModule(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of QUESTION_BANK) {
    counts[q.moduleId] = (counts[q.moduleId] ?? 0) + 1;
  }
  return counts;
}

export interface AssessmentConfig {
  /** Number of questions per module to include (if totalQuestions is not specified). */
  perModule: number;
  /** Optional: restrict to specific modules. */
  moduleIds?: string[];
  /** Optional: restrict to specific tags (e.g. ['tokens', 'context-window']). */
  tags?: string[];
  /** Shuffle option order within each question (for MCQ/multi-select). */
  shuffleOptions: boolean;
  /** If set, pick exactly this many questions from the pooled modules instead of using perModule. */
  totalQuestions?: number;
}

export interface AssessmentQuestion {
  question: Question;
  /** For match-pairs: the shuffled right-side options. For MCQ: shuffled options if configured. */
  renderedOptions?: { id: string; text: string }[];
  shuffledRight?: string[];
}

/**
 * Generate a randomized assessment from the bank.
 * Picks `perModule` questions per module (randomly), shuffles their order,
 * and optionally shuffles options within each question.
 */
export function generateAssessment(config: AssessmentConfig): AssessmentQuestion[] {
  const moduleIds = config.moduleIds ?? ["0", "1", "2", "3", "4", "5", "6", "7"];
  const picked: Question[] = [];
  
  if (config.totalQuestions) {
    const pool: Question[] = [];
    for (const mid of moduleIds) {
      let qList = questionsForModule(mid);
      if (config.tags && config.tags.length > 0) {
        qList = qList.filter(q => q.tags?.some(tag => config.tags!.includes(tag)));
      }
      pool.push(...qList);
    }
    picked.push(...shuffle(pool).slice(0, config.totalQuestions));
  } else {
    for (const mid of moduleIds) {
      let pool = questionsForModule(mid);
      if (config.tags && config.tags.length > 0) {
        pool = pool.filter(q => q.tags?.some(tag => config.tags!.includes(tag)));
      }
      picked.push(...shuffle(pool).slice(0, Math.min(config.perModule, pool.length)));
    }
  }
  
  const shuffled = shuffle(picked);
  return shuffled.map((q) => toRenderable(q, config.shuffleOptions));
}

/** Convert a Question into a renderable form (with shuffled options if applicable). */
export function toRenderable(q: Question, shuffleOptions: boolean): AssessmentQuestion {
  if (q.type === "multiple-choice" || q.type === "multiple-select") {
    const opts = shuffleOptions
      ? shuffle(q.options.map((o) => ({ id: o.id, text: o.text })))
      : q.options.map((o) => ({ id: o.id, text: o.text }));
    return { question: q, renderedOptions: opts };
  }
  if (q.type === "match-pairs") {
    return {
      question: q,
      shuffledRight: shuffle(q.pairs.map((p) => p.right)),
    };
  }
  return { question: q };
}

// ----------------------------------------------------------------------------
// SCORING
// ----------------------------------------------------------------------------

export interface AnswerResult {
  correct: boolean;
  /** For partial-credit multi-select: 0..1 */
  partial?: number;
  feedback?: string;
}

/** Grade a multiple-choice answer. */
export function gradeMultipleChoice(q: MultipleChoiceQuestion, selectedId: string | null): AnswerResult {
  if (!selectedId) return { correct: false, feedback: "No answer selected." };
  const chosen = q.options.find((o) => o.id === selectedId);
  const correctOpt = q.options.find((o) => o.correct);
  return {
    correct: chosen?.correct ?? false,
    feedback: chosen?.feedback ?? (chosen?.correct ? "Correct." : `The correct answer is: ${correctOpt?.text}`),
  };
}

/** Grade a multiple-select answer. Partial credit: correct selections minus incorrect, clamped 0..1. */
export function gradeMultipleSelect(q: MultipleSelectQuestion, selectedIds: string[]): AnswerResult {
  const correctIds = q.options.filter((o) => o.correct).map((o) => o.id);
  const correctSet = new Set(correctIds);
  const selectedArr = Array.from(new Set(selectedIds));
  let correctPicks = 0;
  let incorrectPicks = 0;
  for (const id of selectedArr) {
    if (correctSet.has(id)) correctPicks++;
    else incorrectPicks++;
  }
  const missed = correctIds.filter((id) => !selectedArr.includes(id)).length;
  const partial = Math.max(0, (correctPicks - incorrectPicks) / Math.max(1, correctIds.length));
  const correct = incorrectPicks === 0 && missed === 0 && correctPicks === correctIds.length;
  return { correct, partial, feedback: correct ? "All correct." : `${correctPicks} correct, ${incorrectPicks} incorrect, ${missed} missed.` };
}

/** Grade a fill-in-the-blank answer (case-insensitive, trimmed). */
export function gradeFillBlank(q: FillBlankQuestion, answer: string): AnswerResult {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) return { correct: false, feedback: "No answer entered." };
  const accepted = q.acceptedAnswers.map((a) => a.trim().toLowerCase());
  const correct = accepted.includes(normalized);
  return { correct, feedback: correct ? "Correct." : `Accepted answers: ${q.acceptedAnswers.join(", ")}` };
}

/** Grade a match-pairs answer. `matches` maps left -> right. */
export function gradeMatchPairs(q: MatchPairsQuestion, matches: Record<string, string>): AnswerResult {
  let correctCount = 0;
  for (const pair of q.pairs) {
    if (matches[pair.left] === pair.right) correctCount++;
  }
  const total = q.pairs.length;
  const partial = correctCount / total;
  const correct = correctCount === total;
  return { correct, partial, feedback: `${correctCount}/${total} matched correctly.` };
}

/** Grade any question given the learner's response. */
export function gradeQuestion(q: Question, response: unknown): AnswerResult {
  switch (q.type) {
    case "multiple-choice":
      return gradeMultipleChoice(q, response as string | null);
    case "multiple-select":
      return gradeMultipleSelect(q, response as string[]);
    case "fill-blank":
      return gradeFillBlank(q, response as string);
    case "match-pairs":
      return gradeMatchPairs(q, response as Record<string, string>);
  }
}

export const BANK_STATS = {
  total: QUESTION_BANK.length,
  byModule: questionCountByModule(),
  byType: QUESTION_BANK.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>),
};

