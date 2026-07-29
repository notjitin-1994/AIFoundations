import { Slide } from "@/components/lesson/canvas-viewer";
import { TitleMetaphorSlide } from "./slides/1-title-metaphor";
import { TextVsActionSlide } from "./slides/2-text-vs-action";
import { FunctionCallingSlide } from "./slides/3-function-calling";
import { FunctionCallingLoopSlide } from "./slides/3-function-calling-loop";
import { ToolFilesystemSlide } from "./slides/3b-tool-filesystem";
import { FilesystemRagSlide } from "./slides/3-filesystem-rag";
import { ToolCodeExecutionSlide } from "./slides/3c-tool-code-execution";
import { PluginChaosSlide } from "./slides/4-plugin-chaos";
import { PluginChaosCostSlide } from "./slides/4b-plugin-chaos-cost";
import { McpTranslatorSlide } from "./slides/5-mcp-translator";
import { McpArchitectureSlide } from "./slides/5b-mcp-architecture";
import { McpComponentsSlide } from "./slides/5c-mcp-components";
import { ToolRegistrySlide } from "./slides/6-tool-registry";
import { McpEcosystemSlide } from "./slides/6b-mcp-ecosystem";
import { ImportantMcpsSlide } from "./slides/6c-important-mcps";
import { AgentsMdSlide } from "./slides/17-agents-md";
import { AgentsMdExerciseSlide } from "./slides/8-agents-md-exercise";
import { SkillsEcosystemSlide } from "./slides/18-skills-ecosystem";
import { SkillsDeepDiveSlide } from "./slides/18b-skills-deep-dive";
import { SkillsDirectoriesSlide } from "./slides/18c-skills-directories";
import { EnhancingHarnessSlide } from "./slides/19-enhancing-harness";
import { EnrichingPromptsSlide } from "./slides/20-enriching-prompts";
import { ProjectToolbeltResearchSlide } from "./slides/21-project-toolbelt-research";
import { ProjectToolbeltBlueprintSlide } from "./slides/22-project-toolbelt-blueprint";
import { ToolbeltSetupCheckpointSlide } from "./slides/23-toolbelt-setup-checkpoint";
import { AssessmentIntroSlide } from "./slides/9-assessment-intro";
import { AssessmentRunner } from "@/components/lesson/assessment-runner";

export const MODULE_3_SLIDES: Slide[] = [
  {
    id: "m3-title",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "A raw AI is like a brain trapped in a jar. It can think and talk, but it can't touch the outside world. To take action—to search the web, read files, or control software—it needs a Toolbelt.",
    component: (mark) => <TitleMetaphorSlide onComplete={mark} />
  },
  {
    id: "m3-text-vs-action",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Without tools, an LLM can only generate text based on its past training. With tools, it becomes an active participant in your workflow, capable of fetching live data or executing code.",
    component: (mark) => <TextVsActionSlide onComplete={mark} />
  },
  {
    id: "m3-function-calling",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "The AI itself doesn't browse the internet or run code. It strictly analyzes your prompt and generates a structured request—usually in JSON. This architectural separation is critical for system safety and control.",
    component: (mark) => <FunctionCallingSlide onComplete={mark} />
  },
  {
    id: "m3-function-calling-loop",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Here is the full execution loop. The LLM signals intent, a separate execution harness runs the actual function, and the result is fed back into the LLM to generate your final answer.",
    component: (mark) => <FunctionCallingLoopSlide onComplete={mark} />
  },
  {
    id: "m3-tool-filesystem",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Beyond simple web APIs, one of the most powerful tool categories is filesystem access. By exposing tools like read file and write file, an LLM can analyze your local codebase, review logs, and even rewrite entire documents.",
    component: (mark) => <ToolFilesystemSlide onComplete={mark} />
  },
  {
    id: "m3-filesystem-rag",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Filesystems are essentially local RAG. Saving markdown documents in a folder and initiating the agent there provides the most effective dynamic context management. This is the foundation of skills dot m d systems. We will learn more about this soon. These documents simply teach the AI a certain skill—how to do something in a very specific way. All AI agents use this local RAG approach to read these skills and perform truly exceptional work.",
    component: (mark) => <FilesystemRagSlide onComplete={mark} />
  },
  {
    id: "m3-tool-code-execution",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Another critical category is computational action. LLMs famously struggle with precise math and logic. By using a code interpreter tool, the AI can write a Python script, execute it in a secure sandbox, and return a flawless mathematical result.",
    component: (mark) => <ToolCodeExecutionSlide onComplete={mark} />
  },
  {
    id: "module-3-quiz-1",
    type: "interactive",
    lessonIndex: 1,
    requireCompletion: true,
    fullWidth: true,
    component: (mark) => (
      <AssessmentRunner
        kind="module"
        moduleIds={["3"]}
        tags={["m3-l1"]}
        totalQuestions={10}
        title="Lesson 1 Knowledge Check"
        description="Verify your understanding of function calling and tools."
        onComplete={() => mark()}
      />
    )
  },
  {
    id: "m3-plugin-chaos",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "In the early days, every AI company built their own proprietary way to connect to tools. If you had 5 models and 5 tools, you needed 25 custom, fragile integrations. We call this the N by M integration problem.",
    component: (mark) => <PluginChaosSlide onComplete={mark} />
  },
  {
    id: "m3-plugin-chaos-cost",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "This plugin chaos meant development teams spent most of their time fixing broken plumbing rather than building features. It was a maintenance nightmare, like trying to travel internationally with dozens of different power adapters.",
    component: (mark) => <PluginChaosCostSlide onComplete={mark} />
  },
  {
    id: "m3-mcp-translator",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "In late 2024, the industry aligned on an open standard: The Model Context Protocol, or MCP. Think of it as the USB-C port for AI. It allows any model to securely connect to any external data source using one standardized plug.",
    component: (mark) => <McpTranslatorSlide onComplete={mark} />
  },
  {
    id: "m3-mcp-architecture",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Instead of a chaotic web, MCP uses a clean client-server architecture. An AI application runs an MCP Client, which speaks the standard protocol to any MCP Server. This transforms the N by M nightmare into a simple N plus M equation.",
    component: (mark) => <McpArchitectureSlide onComplete={mark} />
  },
  {
    id: "m3-mcp-components",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "An MCP Server exposes three main capabilities to the LLM: Resources, which provide context like file contents; Prompts, which are reusable templates; and Tools, which are executable functions. This standardizes the entire AI workflow.",
    component: (mark) => <McpComponentsSlide onComplete={mark} />
  },
  {
    id: "m3-tool-registry",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Because MCP is an open standard, a massive community registry of servers has emerged. You don't have to build integrations from scratch. Instead, you can simply pull pre-built servers directly into your AI workflow.",
    component: (mark) => <ToolRegistrySlide onComplete={mark} />
  },
  {
    id: "m3-mcp-ecosystem",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "This means your AI can instantly search the web, pull code from GitHub, query a local PostgreSQL database, or send messages in Slack—all using the exact same standard protocol.",
    component: (mark) => <McpEcosystemSlide onComplete={mark} />
  },
  {
    id: "m3-important-mcps",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "To navigate the rapidly expanding MCP ecosystem, several powerful directories have emerged. Platforms like Smithery.ai, MCP.so, and Glama.ai offer thousands of integrations. For developers, the Official Registry and the Awesome MCP list on GitHub provide high-quality reference implementations.",
    component: (mark) => <ImportantMcpsSlide onComplete={mark} />
  },
  {
    id: "module-3-quiz-2",
    type: "interactive",
    lessonIndex: 2,
    requireCompletion: true,
    fullWidth: true,
    component: (mark) => (
      <AssessmentRunner
        kind="module"
        moduleIds={["3"]}
        tags={["m3-l2"]}
        totalQuestions={10}
        title="Lesson 2 Knowledge Check"
        description="Verify your understanding of the Model Context Protocol (MCP)."
        onComplete={() => mark()}
      />
    )
  },
  {
    id: "m3-agents-md",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Beyond external APIs, modern AI agents rely on Markdown-based documentation like AGENTS.md placed directly in your repository. Think of this as the system prompt translated into code. It gives the agent your project's coding standards, boundaries, and architectural context every time it opens your folder.",
    component: (mark) => <AgentsMdSlide onComplete={mark} />
  },
  {
    id: "m3-agents-md-exercise",
    type: "interactive",
    requireCompletion: true,
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Now it's your turn. Let's build the blueprint for your own AI agents. Click 'Copy Prompt' to grab the instructions, paste them into your favorite AI tool like Gemini or Claude, and fill in your project context. The LLM will generate your custom AGENTS.md file. When it's done, paste the markdown right here into the editor to unlock the next step.",
    component: (mark) => <AgentsMdExerciseSlide onComplete={mark} />
  },
  {
    id: "m3-skills-ecosystem",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "But you can't fit everything into one file. That's where the SKILLS ecosystem comes in. By creating targeted documents like a Frontend Design Skill or a System Architecture Skill, you give the AI specific, modular instructions. For example, a frontend skill can force the AI to use specific Tailwind spacing or animation libraries. It reads the relevant file only when executing that specific task.",
    component: (mark) => <SkillsEcosystemSlide onComplete={mark} />
  },
  {
    id: "m3-skills-deep-dive",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "This ecosystem opens up massive possibilities. You can categorize skills by Workflow, Context, or Expert persona. You can search community repositories and install skills instantly. The ultimate leverage? Digitize your own subject matter expertise. Write a skill that codifies your exact mental models, or even create a 'meta-skill' that teaches the AI how to automatically generate new skills for itself.",
    component: (mark) => <SkillsDeepDiveSlide onComplete={mark} />
  },
  {
    id: "m3-skills-directories",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "So where do you find these skills? Directories like skills.sh and cursor.directory are community-curated goldmines. But the true power move is installing a Meta-Skill—a skill designed solely to analyze your workflow and generate new skills on the fly. Head over to your CLI now and try asking your agent to find and install a skill creator.",
    component: (mark) => <SkillsDirectoriesSlide onComplete={mark} />
  },
  {
    id: "m3-enhancing-harness",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "You can radically enhance your harness by installing these skills directly into your workspace. By keeping a world-class AGENTS.md and modular skill documents in your project folder, any capable harness—like Antigravity or Claude Desktop—will dynamically ingest this context. This is how you transform a generic assistant into a specialized team member.",
    component: (mark) => <EnhancingHarnessSlide onComplete={mark} />
  },
  {
    id: "m3-enriching-prompts",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Finally, to actually trigger these capabilities, you must enrich your prompts. Instead of simply asking the AI to 'build a component', explicitly instruct it to 'use the frontend design skill to build a component'. This forces the agent to read the documentation first via local RAG, ensuring its output perfectly matches your project standards.",
    component: (mark) => <EnrichingPromptsSlide onComplete={mark} />
  },
  {
    id: "module-3-quiz-3",
    type: "interactive",
    lessonIndex: 3,
    requireCompletion: true,
    fullWidth: true,
    component: (mark) => (
      <AssessmentRunner
        kind="module"
        moduleIds={["3"]}
        tags={["m3-l3"]}
        totalQuestions={10}
        title="Lesson 3 Knowledge Check"
        description="Verify your understanding of Skills and Context Engineering."
        onComplete={() => mark()}
      />
    )
  },
  {
    id: "m3-project-toolbelt-research",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "It is time to architect the toolbelt for your specific capstone project. An agent is only as good as the tools it can reach. I want you to open Gemini or ChatGPT in another tab, and paste in this exact prompt. We're going to ask the AI to design the required MCP servers, CLI tools, and skills needed for your chosen project spine. Click the copy button, run the search, and when you have your answers, move to the next screen to document them.",
    component: (mark) => <ProjectToolbeltResearchSlide onComplete={mark} />
  },
  {
    id: "m3-project-toolbelt-blueprint",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    requireCompletion: true,
    hasCustomAudio: false,
    narrationText: "Now that you have your research, it is time to build your blueprint. Document the top MCP servers, CLI tools, and SKILL rulesets you identified. This blueprint will serve as your technical roadmap when we begin assembling your agent's loops in the next module.",
    component: (mark) => <ProjectToolbeltBlueprintSlide onComplete={mark} />
  },
  {
    id: "m3-toolbelt-setup-checkpoint",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Awesome. You've identified the exact tools your project needs. Now, it's time to build it. Before moving on to the knowledge check, open your chosen harness and configure the MCPs and tools you just documented. In the next module, The Engine Room, we will turn this connected environment on.",
    component: (mark) => <ToolbeltSetupCheckpointSlide onComplete={mark} />
  },
  {
    id: "m3-assessment-intro",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    requireCompletion: true,
    hasCustomAudio: false,
    narrationText: "Before we move to the Engine Room, let's verify your understanding of function calling and MCP.",
    component: (mark) => <AssessmentIntroSlide onComplete={mark} />
  },
  {
    id: "module-3-quiz",
    type: "interactive",
    lessonIndex: 4,
    requireCompletion: true,
    fullWidth: true,
    component: (mark) => (
      <AssessmentRunner
        kind="final"
        moduleIds={["3"]}
        tags={["m3-final"]}
        totalQuestions={10}
        title="Module 3 Final Assessment"
        description="Verify your comprehensive understanding of the entire Toolbelt."
        onComplete={() => mark()}
      />
    )
  }
];
