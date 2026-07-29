import { Slide } from "@/components/lesson/canvas-viewer";
import { AssessmentRunner } from "@/components/lesson/assessment-runner";

import { EvolutionStepsSlide } from "./slides/1b-evolution-steps";
import { LoopAnatomySlide } from "./slides/2-loop-anatomy";
import { NaiveExecutionSlide } from "./slides/3a-naive-execution";
import { ReactPatternSlide } from "./slides/3b-react-pattern";
import { CapstoneSimSlide } from "./slides/4-capstone-sim";
import { VerificationSlide } from "./slides/5-verification";
import { HitlSlide } from "./slides/6-hitl";

export const MODULE_4_SLIDES: Slide[] = [

  {
    id: "m4-1b-evolution-steps",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "This is the evolution of AI engineering. We started with Prompt Engineering in Module 1, moved to Context Engineering in Module 2, built our Harness in Module 3, and now, we scale up to designing autonomous, self-correcting agent systems in Module 4.",
    hasCustomAudio: false,
    component: (mark) => <EvolutionStepsSlide onComplete={mark} />
  },
  {
    id: "m4-2-loop-anatomy",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "An autonomous loop isn't magic; it's a structured control system. After each prompt you give, the agent runs this entire loop until the task is complete. It starts with a Goal, Reasons about the next step, Acts using tools, Observes the result, and crucially, Verifies if it's done. Without verification, agents drift into infinite loops. Once the goal is finally verified, the loop pauses at a Human-in-the-loop checkpoint, where you check the agent's work before proceeding.",
    hasCustomAudio: false,
    component: (mark) => <LoopAnatomySlide onComplete={mark} />
  },
  {
    id: "m4-3a-naive-execution",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "Before ReAct, we used naive zero-shot execution. We gave the agent a goal, and it immediately fired a tool. But without a space to plan, it hallucinated arguments, misunderstood context, and ultimately crashed.",
    hasCustomAudio: false,
    component: (mark) => <NaiveExecutionSlide onComplete={mark} />
  },
  {
    id: "m4-3b-react-pattern",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "Enter ReAct: Reason, then Act. ReAct forces the model into an internal monologue. By thinking out loud in a scratchpad, the agent catches its own logical flaws before it ever touches your systems.",
    hasCustomAudio: false,
    component: (mark) => <ReactPatternSlide onComplete={mark} />
  },
  {
    id: "m4-4-capstone-sim",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "Let's see this in action for your specific Capstone. Watch the terminal. You'll see the agent reason about the problem, use the tools you wired in the last module, observe the results, and self-correct when it hits a roadblock. Once you're done watching this simulation, go to your actual Harness, put in a prompt, and observe the actions it takes in real time before continuing.",
    hasCustomAudio: false,
    component: (mark) => <CapstoneSimSlide onComplete={mark} />
  },
  {
    id: "m4-5-verification",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "The most dangerous thing you can do is give an agent a vague goal. 'Make this better' is a recipe for an infinite loop and a massive API bill. A loop must have a rigid, mathematically verifiable 'Done' condition.",
    hasCustomAudio: false,
    component: (mark) => <VerificationSlide onComplete={mark} />
  },
  {
    id: "m4-6-hitl",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "True autonomy is earned, not given. For destructive actions, subjective decisions, or high-stakes outputs, we engineer a Human-in-the-Loop gate. The loop pauses, alerts you, and waits for your cryptographic approval before proceeding.",
    hasCustomAudio: false,
    component: (mark) => <HitlSlide onComplete={mark} />
  },
];
