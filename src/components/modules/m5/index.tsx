import { Slide } from "@/components/lesson/canvas-viewer";
import { M5_TEMPLATE_DATA } from "@/lib/m5-template-data";

import { RecapSlide } from "./slides/1-recap";
import { UpsideDownSlide } from "./slides/2-upside-down";
import { HarnessChecklistSlide } from "./slides/3-harness-checklist";
import { ToolsetChecklistSlide } from "./slides/4-toolset-checklist";
import { ContextRevampSlide } from "./slides/5-context-revamp";
import { PromptRevampSlide } from "./slides/6-prompt-revamp";
import { BestPracticesSlide } from "./slides/7-best-practices";
import { AdvancedSkillsSlide } from "./slides/8-advanced-skills";
import { FinalDeliverablesSlide } from "./slides/9-final-deliverables";

export const MODULE_5_SLIDES: Slide[] = [];

M5_TEMPLATE_DATA.forEach((template, index) => {
  const baseId = `m5-${template.id}`;
  
  MODULE_5_SLIDES.push(
    {
      id: `${baseId}-1-recap`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `You know how to set up your harness, wire tools and MCPs, provide context, and structure prompts. Now, we put it all to the test for your ${template.title}.`,
      hasCustomAudio: false,
      component: (mark) => <RecapSlide data={template} onComplete={mark} />
    },
    {
      id: `${baseId}-2-upside-down`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `We're going upside down. For your ${template.title}, we look at the harness and toolset first, and then use AI to enrich the context and prompt engineering.`,
      hasCustomAudio: false,
      component: (mark) => <UpsideDownSlide data={template} onComplete={mark} />
    },
    {
      id: `${baseId}-3-harness-checklist`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `First, let's verify your harness. To build the ${template.title}, your infrastructure requires a ${template.harnessChecklist[0]}, ${template.harnessChecklist[1]}, and ${template.harnessChecklist[2]}.`,
      hasCustomAudio: false,
      component: (mark) => <HarnessChecklistSlide data={template} onComplete={mark} />
    },
    {
      id: `${baseId}-4-toolset-checklist`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `Next, the toolset. Without these specific skills, your agent will be paralyzed. We will integrate the ${template.toolsetChecklist[0]}, ${template.toolsetChecklist[1]}, and ${template.toolsetChecklist[2]}.`,
      hasCustomAudio: false,
      component: (mark) => <ToolsetChecklistSlide data={template} onComplete={mark} />
    },
    {
      id: `${baseId}-5-context-revamp`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `Now, let's inject rich context. A generic prompt won't work. Before, you might have simply said: "${template.contextRevamp.before}". But now, you'll establish ${template.contextRevamp.title}: "${template.contextRevamp.after}".`,
      hasCustomAudio: false,
      component: (mark) => <ContextRevampSlide data={template} onComplete={mark} />
    },
    {
      id: `${baseId}-6-prompt-revamp`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `With context established, we rebuild your prompts. Instead of a basic command like "${template.promptRevamp.before}", watch how it evolves into a structured execution: "${template.promptRevamp.after}".`,
      hasCustomAudio: false,
      component: (mark) => <PromptRevampSlide data={template} onComplete={mark} />
    },
    {
      id: `${baseId}-7-best-practices`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `Don't forget software engineering fundamentals. When deploying the ${template.title}, you must enforce strict rate limiting, version control, and security boundaries for your MCPs.`,
      hasCustomAudio: false,
      component: (mark) => <BestPracticesSlide data={template} onComplete={mark} />
    },
    {
      id: `${baseId}-8-advanced-skills`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `To push this further, integrating advanced skills gives your agent a definitive edge. Your architecture for the ${template.title} is now fully agentic and ready to execute complex workflows.`,
      hasCustomAudio: false,
      component: (mark) => <AdvancedSkillsSlide data={template} onComplete={mark} />
    },
    {
      id: `${baseId}-9-final-deliverables`,
      type: "interactive",
      lessonIndex: index,
      fullWidth: true,
      requireCompletion: true,
      narrationText: `This is it. Provide the links to your completed ${template.title} deliverables to finalize this capstone. Your journey from concept to application is complete.`,
      hasCustomAudio: false,
      component: (mark) => <FinalDeliverablesSlide data={template} onComplete={mark} />
    }
  );
});
