import { Slide } from "@/components/lesson/canvas-viewer";
import { TitleMetaphorSlide } from "./slides/1-title-metaphor";
import { ForgotNameSlide } from "./slides/2-forgot-name";
import { MechanicsSlide } from "./slides/2a-mechanics";
import { RealWorldConsequencesSlide } from "./slides/2b-real-world";
import { TokensIntroSlide } from "./slides/3-tokens-intro";
import { TokenEconomicsSlide } from "./slides/3a-token-economics";
import { InteractiveTokenizerSlide } from "./slides/4-interactive-tokenizer";
import { ContextWindowsSlide } from "./slides/5-context-windows";
import { LostInMiddleSlide } from "./slides/6-lost-in-middle";
import { AttentionHeatmapSlide } from "./slides/7-attention-heatmap";
import { RagIntroSlide } from "./slides/8-rag-intro";
import { RagPipelineSlide } from "./slides/9-rag-pipeline";
import { RagCompareSlide } from "./slides/10-rag-vs-context";
import { RagFoundationSlide } from "./slides/10b-rag-foundation";
import { ContextEngineeringRulesSlide } from "./slides/11a-context-engineering-rules";
import { MCPTeaserSlide } from "./slides/11b-mcp-teaser";
import { SkillsTeaserSlide } from "./slides/11c-skills-teaser";
import { WebVsLocalSlide } from "./slides/12-web-vs-local";
import { FindingToolsSlide } from "./slides/13-finding-tools";
import { ProjectLLMSlide } from "./slides/14-project-llm";
import { ProjectHarnessSlide } from "./slides/15-project-harness";
import { ProjectCheckpointSlide } from "./slides/16-project-checkpoint";
import { AssessmentRunner } from "@/components/lesson/assessment-runner";

export const MODULE_2_SLIDES: Slide[] = [
  {
    id: "m2-title",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "What happens when the bowl is too small? Like a goldfish, an AI has limited short-term memory. When a conversation exceeds that window, early information simply falls out of reach.",
    component: () => <TitleMetaphorSlide />
  },
  {
    id: "m2-forgot-name",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Have you ever given an AI a long document, set a strict rule at the top, and found it completely ignoring that rule by the end? Let's look at the Goldfish Problem in action. In this chat, we told the AI to always call us 'Captain'. Watch what happens when we feed it a massive 3,500 token report.",
    component: () => <ForgotNameSlide />
  },
  {
    id: "m2-forgot-name-mechanics",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "To understand why this happens, you have to look at how an AI processes conversation history. It doesn't read the chat like a book; it treats it like a conveyor belt with a strict length limit. This is called a First-In-First-Out, or FIFO, queue. When you paste in a massive document, the newest tokens push the oldest tokens—like your critical system instructions—right off the edge of the belt.",
    component: () => <MechanicsSlide />
  },
  {
    id: "m2-real-world-consequences",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "This isn't just an annoyance; it's a critical failure point in production. If you're coding, the AI might revert to older framework versions. In data analysis, it might forget your specific exclusion rules. And in content creation, your carefully crafted brand voice is replaced by generic AI speak. Understanding this limitation is the first step to becoming an AI engineer.",
    component: () => <RealWorldConsequencesSlide />
  },
  {
    id: "m2-tokens-intro",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    requireCompletion: true,
    hasCustomAudio: false,
    narrationText: "Before we solve the problem, we need to understand how AI measures information. Let's talk about Tokens—the true currency of AI. An AI doesn't read words like we do. It breaks text into smaller chunks called tokens. A simple word might be one token, but a complex word like 'Hamburger' gets chopped into 'Ham', 'bur', and 'ger'. Three tokens for one word.",
    component: (mark) => <TokensIntroSlide onComplete={mark} />
  },
  {
    id: "m2-token-economics",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Why does this distinction matter? Because every token has a cost. You are billed per token, both for input and output. Furthermore, tokens are heavily biased towards English. A single sentence in English might be five tokens, but translating that exact sentence to Hindi or Japanese could cost twenty tokens. Finally, tokens define the absolute limit of what the model can remember at once.",
    component: () => <TokenEconomicsSlide />
  },
  {
    id: "m2-tokenizer",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Try typing a sentence below. You'll see that a token isn't always a full word. Sometimes it's a syllable, or even just a space. This is how the AI sees your text.",
    component: () => <InteractiveTokenizerSlide />
  },
  {
    id: "module-2-quiz-1",
    type: "interactive",
    lessonIndex: 1,
    requireCompletion: true,
    fullWidth: true,
    component: (mark) => (
      <AssessmentRunner
        kind="module"
        moduleIds={["2"]}
        tags={["llm", "mechanism", "slm", "deployment", "ml", "tokens", "tokens-estimation", "tokens-tokenization"]}
        totalQuestions={10}
        title="Knowledge Check: The Goldfish Problem & Tokens"
        description="Verify your understanding of AI memory limitations and tokens."
        onComplete={() => mark()}
      />
    )
  },
  {
    id: "m2-context-windows",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "A context window is the absolute limit of tokens an AI can process at one time. In 2023, eight thousand tokens was considered large. By 2026, models can process over a million tokens in a single prompt.",
    component: () => <ContextWindowsSlide />
  },
  {
    id: "m2-lost-in-middle",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "But bigger isn't always better. Research consistently shows a U-shaped performance curve. Models pay close attention to the beginning and end of a prompt, but often ignore what's buried in the middle.",
    component: () => <LostInMiddleSlide />
  },
  {
    id: "m2-attention-heatmap",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Drag the slider to scan through the document's context buffer. Notice how the AI's attention score is perfect at the top and bottom, but plummets in the middle, causing critical details to be completely ignored.",
    component: () => <AttentionHeatmapSlide />
  },
  {
    id: "m2-rag-video",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    requireCompletion: true,
    hasCustomAudio: false,
    narrationText: "So, if stuffing a massive context window doesn't work, what does? The answer is Retrieval-Augmented Generation, or RAG. It's like giving the AI an open-book test.",
    component: (mark) => <RagIntroSlide onComplete={mark} />
  },
  {
    id: "m2-rag-pipeline",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    requireCompletion: true,
    hasCustomAudio: false,
    narrationText: "Click through the steps to see RAG in action. First, a retriever searches a database. Then, it pulls only the most relevant facts. Finally, it injects those specific facts into the context window right before generating the answer.",
    component: (mark) => <RagPipelineSlide onComplete={mark} />
  },
  {
    id: "m2-rag-compare",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "RAG is cheaper, faster, and far more accurate than just pasting a massive document into the prompt. It grounds the AI in reality.",
    component: () => <RagCompareSlide />
  },
  {
    id: "m2-rag-foundation",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "But RAG isn't just a trick for chatting with PDFs. It is the architectural foundation of modern AI. Every time an MCP fetches live data, or an agent loads a specific skill, they are using RAG principles to dynamically manage their context window. This is the essence of Context Engineering.",
    component: () => <RagFoundationSlide />
  },
  {
    id: "module-2-quiz-2",
    type: "interactive",
    lessonIndex: 3,
    requireCompletion: true,
    fullWidth: true,
    component: (mark) => (
      <AssessmentRunner
        kind="module"
        moduleIds={["2"]}
        tags={["context-window", "context-window-cost", "lost-in-middle", "rag", "rag-architecture", "rag-embeddings", "rag-fine-tuning", "rag-chunking", "rag-chunking-application"]}
        totalQuestions={10}
        title="Knowledge Check: Context Windows & RAG"
        description="Verify your understanding of context limits and Retrieval-Augmented Generation."
        onComplete={() => mark()}
      />
    )
  },
  {
    id: "m2-context-engineering",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Context Engineering is the art of managing AI working memory. The three golden rules: keep the context clean by filtering noise, put the most important instructions at the very end to exploit the U-curve, and use external memory to offload large datasets.",
    component: () => <ContextEngineeringRulesSlide />
  },
  {
    id: "m2-mcp-teaser",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "To implement this External Memory, the industry standard is MCP: the Model Context Protocol. MCPs are standardized servers that securely connect your AI to databases, APIs, and file systems. You can find pre-built MCPs at smithery.ai or mcp.so, or even build your own.",
    component: () => <MCPTeaserSlide />
  },
  {
    id: "m2-skills-teaser",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "To implement Clean Context, you use Markdown Skills. Instead of giving an agent one massive, confusing prompt, you create modular dot-MD files that define highly specific behaviors. You can find community skills on GitHub, or simply instruct your agent to research and write new skills for itself.",
    component: () => <SkillsTeaserSlide />
  },

  {
    id: "m2-web-vs-local",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "Web versions of LLMs are often highly sandboxed and limited in the tools they can use. Going forward into the Toolbelt section, you'll need to set up tools and understand how API calls work. We recommend using CLI tools to install and run agents. Or, for a GUI experience, download a Desktop LLM application. The rest of the project steps will require a platform capable of tool calls, MCPs, and skills management.",
    component: (mark) => <WebVsLocalSlide onComplete={mark} />
  },
  {
    id: "m2-finding-tools",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "If you're wondering how to find the best stack for your project, don't worry. The ecosystem is moving fast, but the strategy is simple. For this project tie in, you just need two things. First, select a foundation model known for strong function-calling capabilities. Then, choose a CLI harness or desktop application to host your agent. We will tackle the rest of the toolbelt in the next module.",
    component: () => <FindingToolsSlide />
  },
  {
    id: "m2-project-llm",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    requireCompletion: true,
    hasCustomAudio: false,
    narrationText: "It's time to choose your engine. When researching LLMs, look for providers offering free tiers with API access—this is different from a free chat interface! Some models require a subscription to use their API. For learning, we highly recommend Gemini, as it offers a generous free API tier perfect for getting started.",
    component: (mark) => <ProjectLLMSlide onComplete={mark} />
  },
  {
    id: "m2-project-harness",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    requireCompletion: true,
    hasCustomAudio: false,
    narrationText: "Next, choose your harness. This is the application that will run your agent and give it access to your local environment. While there are many desktop and CLI options available, we highly recommend using the Antigravity CLI or Desktop tool to follow along with this course.",
    component: (mark) => <ProjectHarnessSlide onComplete={mark} />
  },
  {
    id: "m2-project-checkpoint",
    type: "interactive",
    lessonIndex: 4,
    fullWidth: true,
    hasCustomAudio: false,
    narrationText: "At this point, you should have your engine and your harness hooked up, connected, and ready to go. On the next screen, you'll complete the module knowledge check. After that, we'll dive into the next module, where we will explore the toolbelt. You'll learn how to connect your agent to the outside world, allowing it to retrieve and generate answers based on real-time data, rather than just its static training data.",
    component: () => <ProjectCheckpointSlide />
  },
  {
    id: "module-2-quiz",
    type: "interactive",
    lessonIndex: 4,
    requireCompletion: true,
    fullWidth: true,
    component: (mark) => (
      <AssessmentRunner
        kind="module"
        moduleIds={["2"]}
        tags={["context-engineering", "mcp", "markdown-skills", "engine-harness"]}
        totalQuestions={10}
        title="Knowledge Check: Toolbelt Prep"
        description="Verify your understanding of context engineering rules, MCP, and harness environments before moving to Module 3."
        onComplete={() => mark()}
      />
    )
  }
];
