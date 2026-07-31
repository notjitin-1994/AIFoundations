import { Slide } from "@/components/lesson/canvas-viewer";
import { AssessmentRunner } from "@/components/lesson/assessment-runner";

import { IntroSlide } from "./slides/1-intro";
import { LifecycleSlide } from "./slides/2-lifecycle";
import { JudgeSlide } from "./slides/3-judge";
import { DriftSlide } from "./slides/4-drift";
import { PaceSlide } from "./slides/5-pace";
import { SignalSlide } from "./slides/6-signal";
import { JourneySlide } from "./slides/8-journey";
import { GraduationSlide } from "./slides/9-graduation";

export const MODULE_6_SLIDES: Slide[] = [
  // Lesson 1: LLMOps & The Reality of Production
  {
    id: "m6-1-intro",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "You've built your AI app. But a prompt that works once on your laptop isn't production-ready. Welcome to the real world of LLMOps, where applications must survive scale, edge cases, and continuous drift.",
    component: (mark) => <IntroSlide onComplete={mark} />
  },
  {
    id: "m6-2-lifecycle",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "The LLMOps lifecycle replaces prototype thinking with engineering rigor. It introduces version control for prompts, golden datasets for regression testing, and CI/CD pipelines tailored specifically for AI.",
    component: (mark) => <LifecycleSlide onComplete={mark} />
  },
  {
    id: "m6-3-judge",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "How do you know if an LLM's output is actually good? Traditional code tests fail here. Instead, we use LLM-as-a-Judge: employing a superior model like GPT-4 to grade your application's output against a strict semantic rubric.",
    component: (mark) => <JudgeSlide onComplete={mark} />
  },
  {
    id: "m6-4-drift",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "AI is not static. Prompt drift occurs when users change their behavior, or when model providers quietly update their endpoints. Without constant observability and regression testing, your app will silently degrade.",
    component: (mark) => <DriftSlide onComplete={mark} />
  },

  // Lesson 2: The Living Tool Landscape
  {
    id: "m6-5-pace",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "The landscape is evolving at a breakneck pace. New models, frameworks, and techniques drop weekly. You cannot learn everything. You must build a system to filter the noise and focus on durable paradigms.",
    component: (mark) => <PaceSlide onComplete={mark} />
  },
  {
    id: "m6-6-signal",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "We maintain the Tool Landscape as a living document. Check it quarterly. Don't chase every trend. Focus on tools that solve your immediate bottlenecks, whether that's tracing, evaluation, or context retrieval.",
    component: (mark) => <SignalSlide onComplete={mark} />
  },

  // Lesson 3: The Final Assessment
  {
    id: "m6-7-assessment",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    requireCompletion: true,
    component: (mark) => (
      <AssessmentRunner
        id="m6-7-assessment"
        kind="final"
        moduleIds={["1", "2", "3", "4", "5", "6"]}
        totalQuestions={15}
        title="Final Course Assessment"
        description="This is it. A comprehensive evaluation of your journey from concept to application."
        onComplete={() => mark()}
      />
    ),
  },

  // Lesson 4: Course Retrospect & Next Steps
  {
    id: "m6-8-journey",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "Look how far you've come. From understanding tokens and context windows, to wiring tools and MCPs, to orchestrating autonomous agents, and finally deploying robust LLMOps. You are now an AI Engineer.",
    component: (mark) => <JourneySlide onComplete={mark} />
  },
  {
    id: "m6-9-graduation",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "Congratulations. Your capstone is complete, your foundations are solid, and your horizon is clear. Share your work with the community, keep building, and never stop experimenting. Class dismissed.",
    component: (mark) => <GraduationSlide onComplete={mark} />
  }
];
