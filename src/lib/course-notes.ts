export type CourseNote = {
  moduleId: string;
  lessonIndex: number;
  slideIndex: number;
  content: string;
};

export const COURSE_NOTES: CourseNote[] = [
  // MODULE 1: The Intelligence Illusion
  {
    moduleId: "1",
    lessonIndex: 0,
    slideIndex: 0,
    content: "## The Intelligence Illusion\n\nWelcome to Module 1. The core premise here is dismantling the 'Hollywood' version of AI. We are not dealing with sentient beings; we are dealing with highly sophisticated statistical engines. Understanding this difference is the foundational step to designing effective AI workflows."
  },
  {
    moduleId: "1",
    lessonIndex: 0,
    slideIndex: 1,
    content: "## What AI Actually Is\n\nAt its core, a Large Language Model (LLM) is an autocomplete engine on steroids. It does not 'think' or 'reason' in the human sense. It predicts the next most statistically probable token based on its training data and the context window you provide. Remember: **Probability, not Cognition.**"
  },
  {
    moduleId: "1",
    lessonIndex: 1,
    slideIndex: 2,
    content: "## Machine Learning in Plain Language\n\nInstead of being programmed with explicit rules (if X then Y), machine learning models are trained on massive datasets. They identify patterns, weights, and biases across billions of parameters. This means they are inherently fuzzy and non-deterministic."
  },
  {
    moduleId: "1",
    lessonIndex: 2,
    slideIndex: 3,
    content: "## LLMs vs. SLMs\n\nWhile Large Language Models (LLMs) like GPT-4 or Claude 3 Opus excel at generalized tasks and reasoning, Small Language Models (SLMs) like Llama 3 8B or Phi-3 are designed for efficiency. SLMs can run locally, are cheaper, faster, and offer superior privacy for specific, constrained tasks."
  },
  {
    moduleId: "1",
    lessonIndex: 3,
    slideIndex: 4,
    content: "## Anatomy of a Prompt\n\nA world-class prompt is not a magic spell; it's a well-structured set of constraints. It needs a **Persona**, a specific **Task**, a precise **Format**, and **Context**. The more ambiguity you remove, the more deterministic and reliable the output becomes."
  },
  {
    moduleId: "1",
    lessonIndex: 4,
    slideIndex: 5,
    content: "## Hallucinations & Bias\n\nHallucinations are not bugs; they are a feature of generative AI. Because the model is predicting the next token, if it lacks the factual data in its context, it will generate plausible-sounding but incorrect information. Mitigation requires grounding the model (e.g., using RAG)."
  },

  // MODULE 2: The Goldfish Problem
  {
    moduleId: "2",
    lessonIndex: 0,
    slideIndex: 0,
    content: "## The Goldfish Metaphor\n\nAI models are stateless. Every time you send a prompt, it's like waking up an amnesiac. The model only knows what is currently in its 'context window'. If it's not in the prompt, the model doesn't know it."
  },
  {
    moduleId: "2",
    lessonIndex: 1,
    slideIndex: 1,
    content: "## Tokens: The Currency of AI\n\nModels don't read words; they read tokens (chunks of characters). A rough heuristic is that 1 token ≈ 0.75 words. Both cost and processing time scale with token count. Efficient token management is crucial for production systems."
  },
  {
    moduleId: "2",
    lessonIndex: 2,
    slideIndex: 2,
    content: "## Context Windows Explained\n\nThe context window is the model's short-term memory limit. While modern models boast 1M+ token windows, they suffer from the 'Lost in the Middle' phenomenon—they recall the beginning and end of long contexts better than the middle."
  },
  {
    moduleId: "2",
    lessonIndex: 3,
    slideIndex: 3,
    content: "## RAG: Giving AI Long-Term Memory\n\nRetrieval-Augmented Generation (RAG) solves the goldfish problem. Instead of relying on the model's pre-trained knowledge, RAG dynamically searches an external database (using vector embeddings) and injects relevant chunks of information into the prompt before generation."
  },

  // MODULE 3: The Toolbelt
  {
    moduleId: "3",
    lessonIndex: 0,
    slideIndex: 0,
    content: "## From Chat to Action\n\nA language model in isolation can only generate text. To build useful systems, the AI needs to interact with the real world. This is achieved through tools—APIs, databases, web scrapers, and local execution environments."
  },
  {
    moduleId: "3",
    lessonIndex: 1,
    slideIndex: 1,
    content: "## Function Calling Demystified\n\nFunction calling allows you to provide an LLM with a 'menu' of tools. The model doesn't execute the tool; it generates a structured JSON object specifying which tool to use and with what parameters. Your application code then executes the tool and returns the result to the model."
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 2,
    content: "## Model Context Protocol (MCP)\n\nMCP is a standardized protocol that connects LLMs to external data sources and tools seamlessly. It abstracts away the complexity of building custom API integrations, acting as a universal translator between the model and the environment."
  },

  // MODULE 4: The Engine Room
  {
    moduleId: "4",
    lessonIndex: 0,
    slideIndex: 0,
    content: "## Anatomy of a Loop\n\nMoving from linear prompting to agentic workflows means creating a loop: The agent Observes, Thinks, Acts, and then Observes the result of that action. This allows for self-correction and iterative problem-solving."
  },
  {
    moduleId: "4",
    lessonIndex: 1,
    slideIndex: 1,
    content: "## The ReAct Pattern\n\nReason + Act (ReAct) is a foundational framework for agentic behavior. By forcing the model to explicitly state its reasoning ('Thought:') before taking an action ('Action:'), you dramatically improve its reliability and reduce hallucinations."
  },
  {
    moduleId: "4",
    lessonIndex: 2,
    slideIndex: 2,
    content: "## The 'Done' Condition\n\nAn autonomous agent needs a clear exit strategy. Defining rigorous 'done' conditions prevents infinite loops and ensures the agent knows exactly what constitutes a successful task completion."
  },
  {
    moduleId: "4",
    lessonIndex: 3,
    slideIndex: 3,
    content: "## Human-in-the-Loop (HITL)\n\nNot all tasks should be fully autonomous. High-stakes actions (like executing code, sending emails, or making payments) require an explicit human approval checkpoint. HITL is a crucial safety mechanism in agent design."
  },

  // MODULE 5: The Assembly Line
  {
    moduleId: "5",
    lessonIndex: 0,
    slideIndex: 0,
    content: "## The Upside-Down Approach\n\nDon't use one massive prompt for a complex task. Break the task down into an 'assembly line' of specialized AI workers. A planner plans, a writer writes, an editor reviews. This is how you achieve production-grade quality."
  },
  {
    moduleId: "5",
    lessonIndex: 3,
    slideIndex: 4,
    content: "## Context Engineering\n\nPassing context between steps in a workflow is an art. Too little context, and the next step fails. Too much context, and the model gets confused or you waste tokens on irrelevant data. Compress and synthesize context at each handoff."
  }
];

export function getCourseNote(moduleId: string, lessonIndex: number, slideIndex: number): string {
  // Try exact match first
  const exact = COURSE_NOTES.find(
    n => n.moduleId === moduleId && n.lessonIndex === lessonIndex && n.slideIndex === slideIndex
  );
  if (exact) return exact.content;

  // Fallback to lesson-level if slide-level doesn't exist
  const lesson = COURSE_NOTES.find(
    n => n.moduleId === moduleId && n.lessonIndex === lessonIndex
  );
  if (lesson) return lesson.content;

  // Fallback to module-level
  const mod = COURSE_NOTES.find(n => n.moduleId === moduleId);
  if (mod) return mod.content;

  return "## Module Notes\n\nFocus on the core concepts presented in this section. As you build your mental model, remember to map these theoretical concepts to your chosen Project Spine.";
}
