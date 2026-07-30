import { Question } from "./question-bank";

export const EXTENDED_BANK_1: Question[] = [

  {
    id: "ext1-mcq-q1-007",
    moduleId: "2",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["tokens"],
    prompt: "When typing a sentence into an AI tokenizer, how are spaces treated?",
    options: [
      { id: "a", text: "They are completely ignored and stripped out.", correct: false },
      { id: "b", text: "They are treated as tokens themselves or attached to the start of the next word.", correct: true },
      { id: "c", text: "They are replaced by punctuation tokens.", correct: false },
      { id: "d", text: "They count as exactly two tokens.", correct: false }
    ],
    explanation: "As demonstrated in the interactive tokenizer, a token isn't always a full word; sometimes it's a syllable, or even just a space. Spaces are explicitly processed by the model.",
    source: "Module 2.2: Interactive Tokenizer"
  },
  {
    id: "ext1-msel-q1-008",
    moduleId: "2",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["tokens", "ml"],
    prompt: "How does an AI process its conversation history when the input exceeds the context window?",
    options: [
      { id: "a", text: "It treats it like a First-In-First-Out (FIFO) conveyor belt, dropping the oldest tokens.", correct: true },
      { id: "b", text: "It compresses the entire history into a semantic summary.", correct: false },
      { id: "c", text: "It selectively deletes the least important tokens.", correct: false },
      { id: "d", text: "It automatically purchases more context window from the provider.", correct: false }
    ],
    explanation: "An AI does not read the chat like a book; it treats it like a conveyor belt with a strict length limit (a FIFO queue). Newest tokens push the oldest tokens off the edge.",
    source: "Module 2.1: Mechanics"
  },


  {
    id: "ext1-mcq-q1-001",
    moduleId: "2",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["tokens", "tokens-estimation"],
    prompt: "The phenomenon where an AI acts as if it has no memory of the past interactions outside of its immediate context is known as:",
    options: [
      { id: "a", text: "The Goldfish Problem", correct: true },
      { id: "b", text: "The Context Collapse", correct: false },
      { id: "c", text: "Attention Deficit Generation", correct: false },
      { id: "d", text: "Model Amnesia", correct: false }
    ],
    explanation: "AIs are stateless; they have no persistent memory between sessions unless you explicitly feed previous interactions back into their context window. We refer to this lack of persistent memory as The Goldfish Problem.",
    source: "Module 2.1: The Goldfish Problem"
  },
  {
    id: "ext1-mcq-q1-002",
    moduleId: "2",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["tokens", "ml"],
    prompt: "Why is the stateless nature of LLMs considered a critical failure point in production code generation?",
    options: [
      { id: "a", text: "Because the AI might revert to older framework versions or forget your specific architectural rules if not repeatedly reminded.", correct: true },
      { id: "b", text: "Because stateless models run significantly slower than stateful models.", correct: false },
      { id: "c", text: "Because it causes the model to consume exponentially more compute per prompt.", correct: false },
      { id: "d", text: "Because statelessness prevents the AI from using external APIs.", correct: false }
    ],
    explanation: "If you do not explicitly include your specific framework versions, exclusion rules, or coding standards in the context window every time, the AI reverts to its baseline generic training data, which might include outdated or irrelevant code.",
    source: "Module 2.1: Mechanics"
  },
  {
    id: "ext1-mcq-q1-003",
    moduleId: "2",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["tokens", "tokens-tokenization"],
    prompt: "How does an AI model read text?",
    options: [
      { id: "a", text: "It breaks text into smaller subword chunks called tokens.", correct: true },
      { id: "b", text: "It reads letter by letter, similar to early character-based neural networks.", correct: false },
      { id: "c", text: "It reads whole words separated strictly by spaces.", correct: false },
      { id: "d", text: "It analyzes the visual shape of the words rendered on the screen.", correct: false }
    ],
    explanation: "AI models don't read words or letters; they process text in subword units called tokens. A complex word might be broken into three or four distinct tokens.",
    source: "Module 2.2: Tokens Intro"
  },
  {
    id: "ext1-msel-q1-004",
    moduleId: "2",
    type: "multiple-select",
    difficulty: "medium",
    tags: ["tokens", "cost"],
    prompt: "Which of the following statements about token economics are true? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "You are billed based on the number of tokens processed for both input and output.", correct: true },
      { id: "b", text: "Tokens are heavily biased towards the English language.", correct: true },
      { id: "c", text: "A token always equals exactly one English word.", correct: false },
      { id: "d", text: "Translating a sentence from English to Hindi will cost roughly the same number of tokens.", correct: false }
    ],
    explanation: "Token billing occurs on both input (prompts) and output (completions). Because training datasets are English-heavy, tokenizers are highly optimized for English, meaning non-English languages often require many more tokens for the exact same meaning.",
    source: "Module 2.2: Token Economics"
  },
  {
    id: "ext1-fill-q1-005",
    moduleId: "2",
    type: "fill-blank",
    difficulty: "easy",
    tags: ["tokens"],
    prompt: "The absolute limit of what a model can remember at once is defined by its maximum ______ window.",
    placeholder: "Type your answer here...",
    acceptedAnswers: ["context"],
    explanation: "The context window is the hard limit on the number of tokens an AI can process in a single prompt. If you exceed this limit, older information must be truncated or the prompt will fail.",
    source: "Module 2.2: Token Economics"
  },
  {
    id: "ext1-mcq-q1-006",
    moduleId: "2",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["tokens", "ml"],
    prompt: "In an enterprise environment, if a user complains that an AI agent keeps adopting a 'generic AI speak' tone instead of their carefully crafted brand voice, what is the root cause based on Module 2.1?",
    options: [
      { id: "a", text: "The brand voice guidelines are not being explicitly included in the current context window.", correct: true },
      { id: "b", text: "The model has reached its maximum context limit and is deleting the guidelines.", correct: false },
      { id: "c", text: "The AI's temperature is set too low.", correct: false },
      { id: "d", text: "The model requires a massive fine-tuning job on the brand's documentation.", correct: false }
    ],
    explanation: "Due to The Goldfish Problem, unless the brand voice instructions are actively loaded into the immediate context of the prompt, the AI has no memory of them and defaults to its generic training.",
    source: "Module 2.1: Real World Consequences"
  },

  {
    id: "ext1-mcq-q1-009", moduleId: "2", type: "multiple-choice", difficulty: "easy",
    tags: ["context-engineering"],
    prompt: "What are the three golden rules of Context Engineering as taught in this course?",
    options: [
      { id: "a", text: "Clean Context, Golden U-Curve, External Memory", correct: true },
      { id: "b", text: "System Prompts, Few-shot Examples, Chain of Thought", correct: false },
      { id: "c", text: "Pre-training, Fine-tuning, RAG", correct: false },
      { id: "d", text: "Tokens, Embeddings, Vectors", correct: false }
    ],
    explanation: "Context Engineering relies on keeping the context clean, exploiting the U-curve by placing important instructions at the end, and using external memory for large datasets.",
    source: "Module 2.4: Context Engineering"
  },
  {
    id: "ext1-mcq-q1-010", moduleId: "2", type: "multiple-choice", difficulty: "medium",
    tags: ["context-engineering"],
    prompt: "Why is 'Clean Context' important for an LLM?",
    options: [
      { id: "a", text: "To minimize token costs and reduce the chance of hallucinations caused by irrelevant noise.", correct: true },
      { id: "b", text: "To ensure the LLM generates longer responses.", correct: false },
      { id: "c", text: "To bypass safety filters.", correct: false },
      { id: "d", text: "To increase the temperature of the model.", correct: false }
    ],
    explanation: "Extraneous information in the context window increases costs and distracts the model, leading to hallucinations and degraded reasoning.",
    source: "Module 2.4: Context Engineering"
  },
  {
    id: "ext1-fill-q1-011", moduleId: "2", type: "fill-blank", difficulty: "easy",
    tags: ["context-engineering"],
    prompt: "To exploit the U-curve (Positional Bias), you should place your most important instructions at the very ______ of the prompt.",
    placeholder: "Type your answer here...",
    acceptedAnswers: ["end", "bottom"],
    explanation: "Due to the 'Lost in the Middle' phenomenon, LLMs pay the most attention to the very beginning and the very end of their context window.",
    source: "Module 2.4: Context Engineering"
  },
  {
    id: "ext1-mcq-q1-012", moduleId: "2", type: "multiple-choice", difficulty: "easy",
    tags: ["mcp"],
    prompt: "What does MCP stand for in the context of external memory?",
    options: [
      { id: "a", text: "Model Context Protocol", correct: true },
      { id: "b", text: "Machine Compute Provider", correct: false },
      { id: "c", text: "Memory Context Pipeline", correct: false },
      { id: "d", text: "Main Control Program", correct: false }
    ],
    explanation: "MCP stands for Model Context Protocol, which is an open standard for connecting AI models to external data sources and tools.",
    source: "Module 2.4: MCP Teaser"
  },
  {
    id: "ext1-mcq-q1-013", moduleId: "2", type: "multiple-choice", difficulty: "medium",
    tags: ["mcp"],
    prompt: "What is the primary purpose of an MCP server?",
    options: [
      { id: "a", text: "To securely connect your AI to external databases, APIs, and file systems.", correct: true },
      { id: "b", text: "To train a new foundational model from scratch.", correct: false },
      { id: "c", text: "To host a web-based chat interface.", correct: false },
      { id: "d", text: "To manage your billing and token usage.", correct: false }
    ],
    explanation: "MCPs act as standardized bridges that allow an AI to retrieve live data or take actions on external systems, effectively providing it with 'External Memory'.",
    source: "Module 2.4: MCP Teaser"
  },
  {
    id: "ext1-mcq-q1-014", moduleId: "2", type: "multiple-choice", difficulty: "medium",
    tags: ["markdown-skills"],
    prompt: "How do 'Markdown Skills' help achieve a Clean Context?",
    options: [
      { id: "a", text: "By organizing highly specific behaviors into modular .md files instead of using one massive, confusing prompt.", correct: true },
      { id: "b", text: "By automatically deleting older messages from the chat history.", correct: false },
      { id: "c", text: "By compressing text using advanced tokenization algorithms.", correct: false },
      { id: "d", text: "By restricting the AI from using Markdown formatting in its output.", correct: false }
    ],
    explanation: "Instead of loading every possible instruction into the agent's memory at all times, Markdown Skills allow the agent to dynamically load only the specific instructions it needs for the current task.",
    source: "Module 2.4: Skills Teaser"
  },
  {
    id: "ext1-msel-q1-015", moduleId: "2", type: "multiple-select", difficulty: "easy",
    tags: ["engine-harness"],
    prompt: "Which of the following are recommended when choosing your 'engine' (foundation model) for agentic workflows? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Strong function-calling capabilities.", correct: true },
      { id: "b", text: "Generous API access or free tiers for learning.", correct: true },
      { id: "c", text: "Web-only chat interfaces without API access.", correct: false },
      { id: "d", text: "A highly sandboxed environment that restricts tool use.", correct: false }
    ],
    explanation: "For agentic workflows, you need a model that can reliably use tools (function-calling) and you need API access to connect it to your harness. Web-only interfaces are usually too restricted.",
    source: "Module 2.4: Finding Tools"
  },
  {
    id: "ext1-mcq-q1-016", moduleId: "2", type: "multiple-choice", difficulty: "medium",
    tags: ["engine-harness"],
    prompt: "What is the difference between an 'Engine' and a 'Harness'?",
    options: [
      { id: "a", text: "The Engine is the underlying LLM (e.g., Gemini), while the Harness is the application (e.g., Antigravity CLI) that runs the agent and provides access to tools.", correct: true },
      { id: "b", text: "The Engine is the user interface, while the Harness is the database.", correct: false },
      { id: "c", text: "They are interchangeable terms for the same concept.", correct: false },
      { id: "d", text: "The Engine is the hardware GPU, while the Harness is the operating system.", correct: false }
    ],
    explanation: "The Engine provides the intelligence (the LLM API), but it needs a Harness (like a CLI or Desktop app) to execute code, read files, and interface with the real world.",
    source: "Module 2.4: Project Harness"
  },
  {
    id: "ext1-mcq-q1-017", moduleId: "2", type: "multiple-choice", difficulty: "medium",
    tags: ["engine-harness"],
    prompt: "Why might a web-based chat interface (like standard ChatGPT or Gemini web) be insufficient for advanced agentic workflows?",
    options: [
      { id: "a", text: "They are often highly sandboxed and do not allow the AI to execute local CLI commands or freely access your file system.", correct: true },
      { id: "b", text: "They do not use real LLMs.", correct: false },
      { id: "c", text: "They charge per token, whereas local CLI tools do not.", correct: false },
      { id: "d", text: "They have a smaller context window than the API version of the same model.", correct: false }
    ],
    explanation: "Web interfaces protect the user by sandboxing the AI. True agentic workflows require local tools (CLI or Desktop harnesses) so the agent can read and write files and execute commands on your machine.",
    source: "Module 2.4: Web vs Local"
  },
  {
    id: "ext1-match-q1-018", moduleId: "2", type: "match-pairs", difficulty: "intermediate",
    tags: ["context-engineering", "mcp", "markdown-skills", "engine-harness"],
    prompt: "Match the Context Engineering concept to its implementation.",
    pairs: [
      { left: "External Memory", right: "Model Context Protocol (MCP)" },
      { left: "Clean Context", right: "Modular Markdown Skills" },
      { left: "Golden U-Curve", right: "Placing critical instructions at the end" },
      { left: "Harness", right: "Desktop LLM app or CLI" }
    ],
    explanation: "MCP provides external memory, Markdown skills provide modular clean context, the U-curve dictates instruction placement, and the Harness runs the environment.",
    source: "Module 2.4 Summary"
  },

  // ========================================================================
  // BATCH 1: 50 Questions (ID-certified, scenario-based)
  // ========================================================================
  
  // MODULE 1: THE INTELLIGENCE ILLUSION
  {
    id: "ext1-mcq-001", moduleId: "1", type: "multiple-choice", difficulty: "intermediate",
    prompt: "You are reviewing a chatbot's response to a customer, and you notice the bot confidently fabricated a refund policy that doesn't exist. According to the mechanics of large language models, what is the most likely cause?",
    options: [
      { id: "a", text: "The model's internal search engine queried an outdated database.", correct: false },
      { id: "b", text: "The model is predicting the most statistically probable next token based on training data, without actual comprehension of truth.", correct: true },
      { id: "c", text: "The temperature setting was too low.", correct: false },
      { id: "d", text: "The model was deliberately programmed to prioritize customer satisfaction over accuracy.", correct: false }
    ],
    explanation: "LLMs do not look up facts in a database (unless using RAG). They generate text by predicting the next token. Hallucinations happen because a sequence of words is statistically probable, even if it is factually incorrect."
  },
  {
    id: "ext1-mcq-002", moduleId: "1", type: "multiple-choice", difficulty: "advanced",
    prompt: "A project manager wants to deploy a 70B parameter frontier model to analyze highly sensitive, unanonymized patient health records (PHI). Which is the strongest architectural argument against this approach?",
    options: [
      { id: "a", text: "The model will likely refuse the prompt because 70B models are too large to process medical data.", correct: false },
      { id: "b", text: "Frontier models accessed via cloud APIs transmit sensitive data off-network, violating HIPAA and privacy requirements.", correct: true },
      { id: "c", text: "The prompt lacks sufficient Few-Shot examples.", correct: false },
      { id: "d", text: "PHI requires models trained exclusively on medical texts, which frontier models are not.", correct: false }
    ],
    explanation: "Cloud-based frontier models transmit data to external servers. For highly sensitive data like PHI, a local Small Language Model (SLM) running on secure, on-premise hardware is the architecturally sound choice."
  },
  {
    id: "ext1-fill-001", moduleId: "1", type: "fill-blank", difficulty: "foundational",
    prompt: "When writing prompts, adding context about the audience and tone, along with the specific data to operate on, helps guide the model. The component of the prompt that specifies the desired format (e.g., 'produce a bulleted list') is called the Output ______.",
    acceptedAnswers: ["Indicator", "indicator"],
    placeholder: "one word",
    explanation: "The Output Indicator signals the format or structure the model should use when returning its response."
  },
  {
    id: "ext1-msel-001", moduleId: "1", type: "multiple-select", difficulty: "intermediate",
    prompt: "You are setting up a local AI assistant to draft technical documentation. Which of the following parameters should you adjust to ensure the output remains highly factual, predictable, and focused? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Set Temperature near 0.1", correct: true },
      { id: "b", text: "Set Top-p to a low threshold (e.g., 0.1)", correct: true },
      { id: "c", text: "Increase Frequency Penalty to maximum", correct: false },
      { id: "d", text: "Increase Temperature to 0.9", correct: false }
    ],
    explanation: "Low temperature and low top-p (nucleus sampling) constrain the model to only the most probable tokens, reducing creative variance and increasing factual predictability."
  },
  {
    id: "ext1-mcq-003", moduleId: "1", type: "multiple-choice", difficulty: "advanced",
    prompt: "A recruiting team uses an AI tool to screen resumes. After six months, they notice the tool systematically ranks candidates from a specific demographic lower. Using the NIST AI RMF, which bias family is most likely responsible?",
    options: [
      { id: "a", text: "Systemic bias", correct: false },
      { id: "b", text: "Statistical bias", correct: true },
      { id: "c", text: "Human-cognitive bias", correct: false },
      { id: "d", text: "Intentional bias", correct: false }
    ],
    explanation: "Statistical bias occurs when the model's training data (e.g., past hiring records) contains historical imbalances, which the model mathematically replicates."
  },
  
  // MODULE 2: THE GOLDFISH PROBLEM
  {
    id: "ext1-mcq-004", moduleId: "2", type: "multiple-choice", difficulty: "intermediate",
    tags: ["lost-in-middle"],
  prompt: "You paste a 40-page HR handbook into an LLM and ask it about the remote work policy located on page 20. The LLM hallucinates an answer instead of referencing the policy. What cognitive phenomenon explains this?",
    options: [
      { id: "a", text: "Token starvation", correct: false },
      { id: "b", text: "Lost in the Middle", correct: true },
      { id: "c", text: "Context fragmentation", correct: false },
      { id: "d", text: "Gradient degradation", correct: false }
    ],
    explanation: "The 'Lost in the Middle' phenomenon (Liu et al.) describes how LLMs struggle to recall information buried in the middle of a large context window, performing best on data at the very beginning or very end."
  },
  {
    id: "ext1-mcq-005", moduleId: "2", type: "multiple-choice", difficulty: "advanced",
    prompt: "When designing a Retrieval-Augmented Generation (RAG) system for a repository of legal contracts, why is semantic or document-structure chunking preferred over fixed-size chunking (e.g., 500 tokens)?",
    options: [
      { id: "a", text: "Fixed-size chunking might split a single legal clause across two chunks, destroying the context the retriever needs.", correct: true },
      { id: "b", text: "Fixed-size chunking uses too much vector database storage.", correct: false },
      { id: "c", text: "Semantic chunking forces the LLM to rewrite the text.", correct: false },
      { id: "d", text: "Fixed-size chunks are incompatible with modern embedding models.", correct: false }
    ],
    explanation: "Document-structure chunking respects natural boundaries (like paragraphs or clauses), ensuring that when a chunk is retrieved, it contains a complete thought rather than a fractured sentence."
  },
  {
    id: "ext1-fill-002", moduleId: "2", type: "fill-blank", difficulty: "foundational",
    prompt: "In a RAG architecture, the process of converting raw text into numerical vectors that capture semantic meaning is performed by a specialized ______ model.",
    acceptedAnswers: ["embedding", "embeddings"],
    placeholder: "one word",
    explanation: "Embedding models specialize in turning text into mathematical vectors so that semantic similarity can be calculated during a search."
  },
  {
    id: "ext1-msel-002", moduleId: "2", type: "multiple-select", difficulty: "intermediate",
    tags: ["rag-architecture"],
  prompt: "Which of the following scenarios are appropriate use cases for RAG? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Answering questions based on a constantly updating internal wiki.", correct: true },
      { id: "b", text: "Generating responses that require citing the specific source document.", correct: true },
      { id: "c", text: "Teaching a model a completely new language syntax from scratch.", correct: false },
      { id: "d", text: "Providing an LLM access to real-time inventory databases.", correct: true }
    ],
    explanation: "RAG is perfect for dynamic knowledge, citing sources, and accessing private data. Teaching a model fundamental syntax requires training or fine-tuning, not just retrieval."
  },
  {
    id: "ext1-match-001", moduleId: "2", type: "match-pairs", difficulty: "intermediate",
    tags: ["rag-architecture"],
  prompt: "Match the RAG component to its primary function.",
    pairs: [
      { left: "Retriever", right: "Queries the vector database for relevant chunks." },
      { left: "Vector Database", right: "Stores embedded representations of the knowledge base." },
      { left: "Generator", right: "Synthesizes the final answer using the retrieved context." },
      { left: "Chunker", right: "Splits large documents into digestible pieces." }
    ],
    explanation: "A RAG pipeline relies on Chunking text, Storing it in a Vector Database, Retrieving relevant chunks via search, and Generating an answer using those chunks."
  },

  // MODULE 3: THE TOOLBELT
  {
    id: "ext1-mcq-006", moduleId: "3", type: "multiple-choice", difficulty: "intermediate",
    prompt: "You want an LLM to automatically check the weather before drafting a packing list. Which mechanism allows the LLM to do this?",
    options: [
      { id: "a", text: "Model Fine-tuning", correct: false },
      { id: "b", text: "Tool Calling / Function Calling", correct: true },
      { id: "c", text: "Increasing the Context Window", correct: false },
      { id: "d", text: "Next-token probability adjustment", correct: false }
    ],
    explanation: "Tool calling allows the LLM to output structured data (like JSON) indicating it wants to execute a function (like checking the weather). A separate runtime executes it and feeds the result back to the LLM."
  },
  {
    id: "ext1-mcq-007", moduleId: "3", type: "multiple-choice", difficulty: "advanced",
    prompt: "What security risk does tool calling introduce that standard text generation does not?",
    options: [
      { id: "a", text: "The model might hallucinate text.", correct: false },
      { id: "b", text: "The model could execute destructive operations (like deleting files) if the runtime automatically grants permission.", correct: true },
      { id: "c", text: "The model might use more API credits.", correct: false },
      { id: "d", text: "The model might forget the conversation history.", correct: false }
    ],
    explanation: "Because tools enable actual execution (API requests, file modifications, command runs), a malicious or hallucinated tool call can cause real-world damage without human-in-the-loop safeguards."
  },
  {
    id: "ext1-fill-003", moduleId: "3", type: "fill-blank", difficulty: "intermediate",
    prompt: "An open standard introduced in late 2024 designed to allow AI models to connect seamlessly to data sources and tools is known by the acronym ______.",
    acceptedAnswers: ["MCP"],
    placeholder: "three letters",
    explanation: "MCP (Model Context Protocol) is an open standard that allows LLMs to connect to external data sources safely."
  },
  {
    id: "ext1-msel-003", moduleId: "3", type: "multiple-select", difficulty: "foundational",
    prompt: "Without tools, an LLM is effectively isolated. Which of these are limitations of an isolated LLM? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "It cannot browse the live web.", correct: true },
      { id: "b", text: "It cannot execute mathematical calculations reliably.", correct: true },
      { id: "c", text: "It cannot generate coherent sentences.", correct: false },
      { id: "d", text: "It cannot interact with your local file system.", correct: true }
    ],
    explanation: "Isolated LLMs are frozen in time, isolated from the internet and local files, and struggle with deterministic tasks like math. Tools bridge these gaps."
  },

  // MODULE 4: THE ENGINE ROOM
  {
    id: "ext1-mcq-008", moduleId: "4", type: "multiple-choice", difficulty: "intermediate",
    prompt: "In an agentic architecture, what differentiates an 'Agent' from a standard chat prompt?",
    options: [
      { id: "a", text: "An agent is just a prompt with a very long context window.", correct: false },
      { id: "b", text: "An agent can autonomously plan a sequence of actions, execute tools, observe the results, and iterate.", correct: true },
      { id: "c", text: "An agent uses a specialized proprietary LLM.", correct: false },
      { id: "d", text: "An agent is a physical robot.", correct: false }
    ],
    explanation: "Agency is defined by the loop: Plan -> Act (using tools) -> Observe (results) -> Iterate. This allows an AI system to solve multi-step problems autonomously."
  },
  {
    id: "ext1-mcq-009", moduleId: "4", type: "multiple-choice", difficulty: "advanced",
    prompt: "A developer builds an agent to automatically review code and merge pull requests. To prevent the agent from accidentally merging broken code, what specific guardrail should be implemented?",
    options: [
      { id: "a", text: "Lowering the temperature parameter.", correct: false },
      { id: "b", text: "Human-in-the-loop (HITL) checkpointing prior to execution.", correct: true },
      { id: "c", text: "A secondary agent to summarize the code.", correct: false },
      { id: "d", text: "Increasing the agent's context memory.", correct: false }
    ],
    explanation: "For irreversible or high-stakes actions, a Human-in-the-Loop (HITL) checkpoint is necessary so a human can authorize the tool execution."
  },
  {
    id: "ext1-fill-004", moduleId: "4", type: "fill-blank", difficulty: "advanced",
    prompt: "An agent retains information across multiple sessions by writing to ______ memory, distinguishing it from context memory which resets each conversation.",
    acceptedAnswers: ["persistent", "long-term", "longterm"],
    placeholder: "one word",
    explanation: "Persistent memory allows agents to recall information across entirely different sessions by storing it in a database."
  },
  {
    id: "ext1-msel-004", moduleId: "4", type: "multiple-select", difficulty: "intermediate",
    prompt: "Which of the following are distinct components of an AI 'harness'? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Memory Management", correct: true },
      { id: "b", text: "Tool Execution Runtime", correct: true },
      { id: "c", text: "The Neural Network Weights", correct: false },
      { id: "d", text: "Guardrails and Safety Checkpoints", correct: true }
    ],
    explanation: "The harness is the software wrapper around the LLM that provides orchestration, tools, memory, and safety. The neural network weights are the model itself."
  },

  // MODULE 5: THE ASSEMBLY LINE
  {
    id: "ext1-mcq-010", moduleId: "5", type: "multiple-choice", difficulty: "foundational",
    prompt: "What is the primary benefit of decomposing a complex AI task into a multi-step workflow rather than using a single mega-prompt?",
    options: [
      { id: "a", text: "Workflows use fewer API credits.", correct: false },
      { id: "b", text: "Workflows allow for specialized prompts at each step, enabling self-correction, review, and significantly higher quality outputs.", correct: true },
      { id: "c", text: "Workflows run faster than single prompts.", correct: false },
      { id: "d", text: "Mega-prompts are deprecated by OpenAI.", correct: false }
    ],
    explanation: "Decomposing tasks into workflows (e.g., Ideate -> Draft -> Critique -> Revise) mimics human assembly lines. It allows the model to critique its own work and produces superior results to zero-shot 'do it all at once' prompts."
  },
  {
    id: "ext1-mcq-011", moduleId: "5", type: "multiple-choice", difficulty: "intermediate",
    prompt: "In a low-code automation tool like n8n or Make, what represents the individual actions (like parsing an email or querying an LLM)?",
    options: [
      { id: "a", text: "Nodes", correct: true },
      { id: "b", text: "Tensors", correct: false },
      { id: "c", text: "Parameters", correct: false },
      { id: "d", text: "Tokens", correct: false }
    ],
    explanation: "Visual automation tools use 'nodes' to represent distinct actions or API calls, connected by wires representing the flow of data."
  },
  {
    id: "ext1-msel-005", moduleId: "5", type: "multiple-select", difficulty: "advanced",
    prompt: "Which of the following sub-labs are featured in Module 5: The Assembly Line? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Content Generation Workflow", correct: true },
      { id: "b", text: "Coding / Software Development Workflow", correct: true },
      { id: "c", text: "Media & Asset Generation Workflow", correct: true },
      { id: "d", text: "Hardware Provisioning Workflow", correct: false }
    ],
    explanation: "Module 5 focuses on transforming raw inputs into polished outputs across Content, Coding, and Media. Hardware provisioning is outside the scope of AI workflow labs."
  },

  // MODULE 6: THE LOCAL SANDBOX
  {
    id: "ext1-mcq-012", moduleId: "6", type: "multiple-choice", difficulty: "foundational",
    prompt: "You are traveling on an airplane without Wi-Fi and need to summarize a local PDF document using AI. Which tool allows you to do this?",
    options: [
      { id: "a", text: "ChatGPT Plus", correct: false },
      { id: "b", text: "Ollama running a local SLM", correct: true },
      { id: "c", text: "Google Cloud Vertex AI", correct: false },
      { id: "d", text: "Claude API", correct: false }
    ],
    explanation: "Ollama (or LM Studio) allows you to download and run Small Language Models locally on your device's hardware, functioning entirely offline."
  },
  {
    id: "ext1-mcq-013", moduleId: "6", type: "multiple-choice", difficulty: "intermediate",
    prompt: "Which model compression technique reduces the precision of the numerical weights (e.g., from 16-bit floats to 4-bit integers) so a model can fit in a laptop's RAM?",
    options: [
      { id: "a", text: "Pruning", correct: false },
      { id: "b", text: "Knowledge Distillation", correct: false },
      { id: "c", text: "Quantization", correct: true },
      { id: "d", text: "Tokenization", correct: false }
    ],
    explanation: "Quantization reduces the bit-precision of the model's parameters, drastically reducing memory footprint while maintaining reasonable performance."
  },
  {
    id: "ext1-fill-005", moduleId: "6", type: "fill-blank", difficulty: "intermediate",
    prompt: "Because Small Language Models (SLMs) have significantly fewer parameters than frontier models, they are generally less capable at deep logical reasoning but highly efficient at specific, narrow tasks. A common SLM parameter count ranges from 1 to 10 ______.",
    acceptedAnswers: ["billion", "Billion", "B"],
    placeholder: "a magnitude (e.g., million, billion)",
    explanation: "SLMs typically range from 1 to 10 billion parameters, allowing them to run efficiently on consumer hardware."
  },

  // MODULE 7: THE HORIZON
  {
    id: "ext1-mcq-014", moduleId: "7", type: "multiple-choice", difficulty: "foundational",
    prompt: "Given the rapid evolution of the AI landscape, what is the primary purpose of the 'Tool Landscape' resource in this course?",
    options: [
      { id: "a", text: "To list every single AI tool ever created.", correct: false },
      { id: "b", text: "To provide a curated, versioned list of current best-in-class tools that is refreshed quarterly.", correct: true },
      { id: "c", text: "To sell software subscriptions.", correct: false },
      { id: "d", text: "To rank models based on subjective aesthetic preference.", correct: false }
    ],
    explanation: "Because tools churn constantly, a versioned, quarterly-refreshed landscape provides learners with a reliable snapshot of the current state of the art without overwhelming them."
  },
  {
    id: "ext1-match-002", moduleId: "7", type: "match-pairs", difficulty: "advanced",
    prompt: "Match the organizational readiness tier with its characteristic behavior regarding AI adoption.",
    pairs: [
      { left: "Ad-hoc / Shadow IT", right: "Employees use unapproved AI tools individually." },
      { left: "Exploratory", right: "Organization sanctions specific tools but lacks central strategy." },
      { left: "Systemic", right: "AI is embedded into organizational workflows with clear governance." }
    ],
    explanation: "Organizations typically mature from unauthorized Shadow IT, to sanctioned Exploratory use, and finally to Systemic, governed integration."
  },
  
  // EXTRA DEPTH: AI LITERACY & INCLUSIVE DESIGN
  {
    id: "ext1-mcq-015", moduleId: "0", type: "multiple-choice", difficulty: "advanced",
    prompt: "An instructional designer creates an AI ethics scenario where the 'careless employee' is exclusively represented by stock photos of older workers. According to the Master ID inclusive design lens, what is the impact of this decision?",
    options: [
      { id: "a", text: "It accurately reflects statistical tech adoption rates.", correct: false },
      { id: "b", text: "It introduces a subtle stereotype threat, alienating older learners and associating age with technological incompetence.", correct: true },
      { id: "c", text: "It improves cognitive load by using consistent characters.", correct: false },
      { id: "d", text: "It has no impact; learners ignore decorative imagery.", correct: false }
    ],
    explanation: "Inclusive design requires that scenarios and imagery do not enforce stereotypes. Consistently depicting older workers as the 'problem' creates identity threat and alienation."
  },
  {
    id: "ext1-mcq-016", moduleId: "0", type: "multiple-choice", difficulty: "intermediate",
    prompt: "According to the UNESCO AI Competency Framework, 'AI Literacy' involves not just using AI, but also understanding its:",
    options: [
      { id: "a", text: "C++ source code architecture.", correct: false },
      { id: "b", text: "Human rights implications, ethical dimensions, and societal impacts.", correct: true },
      { id: "c", text: "Stock market valuations.", correct: false },
      { id: "d", text: "Ability to replace teachers.", correct: false }
    ],
    explanation: "UNESCO strongly emphasizes a human-centered approach, meaning AI literacy requires understanding the ethical and societal impacts of the technology, not just technical deployment."
  },
  {
    id: "ext1-msel-006", moduleId: "1", type: "multiple-select", difficulty: "advanced",
    prompt: "When communicating the limitations of generative AI to a non-technical stakeholder, which analogies are instructionally sound? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "It's like an incredibly well-read intern who is eager to please but prone to making things up if they don't know the answer.", correct: true },
      { id: "b", text: "It's a super-advanced autocomplete on your phone.", correct: true },
      { id: "c", text: "It's a sentient database that looks up facts from a vast hard drive.", correct: false },
      { id: "d", text: "It's an engine that predicts the statistically most likely next word based on patterns.", correct: true }
    ],
    explanation: "Sentience and 'looking up facts' are dangerous misconceptions (the Intelligence Illusion). The intern, autocomplete, and pattern-prediction analogies accurately model next-token behavior."
  },
  {
    id: "ext1-mcq-017", moduleId: "2", type: "multiple-choice", difficulty: "intermediate",
    tags: ["rag"],
  prompt: "If a company uses an LLM to generate customer support emails based on highly technical manuals, why is RAG a better solution than relying on the LLM's pre-trained knowledge?",
    options: [
      { id: "a", text: "The LLM's pre-trained knowledge is static and may not include the company's proprietary or recently updated manuals.", correct: true },
      { id: "b", text: "RAG prevents the LLM from generating typos.", correct: false },
      { id: "c", text: "RAG models do not use tokens.", correct: false },
      { id: "d", text: "RAG makes the LLM self-aware.", correct: false }
    ],
    explanation: "Pre-trained knowledge is frozen at training time. RAG provides the model with dynamic, up-to-date context injected directly into the prompt."
  },
  {
    id: "ext1-mcq-018", moduleId: "3", type: "multiple-choice", difficulty: "advanced",
    prompt: "An AI system is configured with a 'Search Database' tool. When a user asks 'What is John Doe's salary?', the AI executes the tool and outputs the salary. What critical design component was neglected?",
    options: [
      { id: "a", text: "Tokenization limits.", correct: false },
      { id: "b", text: "Context window overlap.", correct: false },
      { id: "c", text: "Role-Based Access Control (RBAC) at the tool execution runtime level.", correct: true },
      { id: "d", text: "Quantization of the vector space.", correct: false }
    ],
    explanation: "If an AI has access to a tool, the *tool runtime* must enforce user permissions. The LLM cannot reliably enforce security policies on its own."
  },
  {
    id: "ext1-mcq-019", moduleId: "4", type: "multiple-choice", difficulty: "intermediate",
    prompt: "What is the primary difference between trajectory memory and context memory in an agentic framework?",
    options: [
      { id: "a", text: "They are exactly the same.", correct: false },
      { id: "b", text: "Trajectory memory records the sequence of actions and tool results the agent took to solve the current task; context memory is the overall conversation history.", correct: true },
      { id: "c", text: "Trajectory memory is stored in a vector DB, context memory is stored in RAM.", correct: false },
      { id: "d", text: "Trajectory memory only exists in SLMs.", correct: false }
    ],
    explanation: "Trajectory memory (or scratchpad) tracks the agent's internal thought-action-observation loop during a single task. Context memory tracks the human-agent conversation."
  },
  {
    id: "ext1-fill-006", moduleId: "5", type: "fill-blank", difficulty: "advanced",
    prompt: "When designing an AI workflow, introducing a step where the AI evaluates its own initial output against a set of criteria before generating a final version is known as an automated ______ step.",
    acceptedAnswers: ["critique", "review", "evaluation"],
    placeholder: "one word",
    explanation: "An automated critique step allows the LLM to spot and fix its own errors before presenting the final result to the user."
  },
  {
    id: "ext1-msel-007", moduleId: "6", type: "multiple-select", difficulty: "foundational",
    prompt: "Which of the following environments are ideal candidates for deploying Local AI (Small Language Models)? Select all that apply.",
    selectAllThatApply: true,
    options: [
      { id: "a", text: "Air-gapped defense networks", correct: true },
      { id: "b", text: "Hospitals processing patient data on-premise", correct: true },
      { id: "c", text: "Consumer smartphones running on-device assistants", correct: true },
      { id: "d", text: "A global search engine indexing the entire internet", correct: false }
    ],
    explanation: "Local AI excels where privacy, offline capability, or edge deployment (smartphones) is critical. Indexing the internet requires massive server-side frontier models."
  },
  {
    id: "ext1-mcq-020", moduleId: "7", type: "multiple-choice", difficulty: "intermediate",
    prompt: "When updating a corporate L&D strategy for AI, why is it risky to mandate a single specific tool (e.g., 'Everyone must use ChatGPT-4')?",
    options: [
      { id: "a", text: "ChatGPT is illegal in the US.", correct: false },
      { id: "b", text: "The tool landscape shifts rapidly; locking into one specific vendor prevents leveraging specialized or newer tools (e.g., Claude for writing, specialized code agents).", correct: true },
      { id: "c", text: "Employees cannot learn more than one tool.", correct: false },
      { id: "d", text: "All tools share the exact same underlying model.", correct: false }
    ],
    explanation: "Locking into a single AI vendor is risky because the field evolves rapidly — specialized tools for writing, coding, and analysis each have unique strengths that a single vendor cannot cover.",
  },
  // ========================================================================
  // BATCH 2: Advanced Scenario-based Questions (World-Class ID Standards)
  // ========================================================================
  {
    id: "ext2-mcq-001", moduleId: "2", type: "multiple-choice", difficulty: "advanced",
    tags: ["lost-in-middle"],
  prompt: "A developer complains that when passing a 50-page legal document into a large language model with specific formatting instructions at the very beginning, the model frequently ignores the instructions by the end of the text. Based on the 'Lost in the Middle' phenomenon and context limits, which of the following is the most effective architectural solution?",
    options: [
      { id: "a", text: "Break the document into individual tokens and submit each token in a separate API call.", correct: false },
      { id: "b", text: "Implement Retrieval-Augmented Generation (RAG) to dynamically inject only the most relevant sections of the document, and place the critical formatting instructions at the very end of the prompt.", correct: true },
      { id: "c", text: "Upgrade to a model with a larger overall parameter count, as larger models natively remember all instructions regardless of placement.", correct: false },
      { id: "d", text: "Translate the legal document into a more token-efficient language like Japanese before processing.", correct: false }
    ],
    explanation: "Models exhibit a U-shaped attention curve, performing best at the beginning and end of a context window. RAG reduces the context noise, and placing critical instructions at the end exploits the model's recency bias."
  },
  {
    id: "ext2-mcq-002", moduleId: "2", type: "multiple-choice", difficulty: "intermediate",
    tags: ["tokens-cost"],
  prompt: "An organization is migrating its customer service chatbot from English to Spanish. They notice their monthly API billing has increased despite handling the same volume of customer requests. What is the primary reason for this discrepancy?",
    options: [
      { id: "a", text: "Spanish requires more computationally intensive algorithms to process due to grammatical structure.", correct: false },
      { id: "b", text: "The model is automatically searching external translation databases for each request.", correct: false },
      { id: "c", text: "Tokens are heavily biased towards English; languages other than English often require significantly more tokens to represent the same meaning.", correct: true },
      { id: "d", text: "The First-In-First-Out (FIFO) queue limit is shorter for non-English languages.", correct: false }
    ],
    explanation: "Because models are primarily trained on English text, their tokenizers are highly optimized for English words. Non-English text often gets broken down into smaller, sub-word tokens, driving up the total token count and cost."
  },
  {
    id: "ext2-mcq-003", moduleId: "3", type: "multiple-choice", difficulty: "advanced",
    prompt: "An autonomous agent is tasked with summarizing an internal corporate database. The developer has provided the agent with a 'read_database' tool. However, the agent's output is consistently hallucinated and fails to actually fetch the live data. Assuming the tool itself functions perfectly, what is the most critical missing step in the execution loop?",
    options: [
      { id: "a", text: "The execution harness is not returning the executed JSON result back into the LLM's context window.", correct: true },
      { id: "b", text: "The agent is using an outdated version of the Python programming language in its sandbox.", correct: false },
      { id: "c", text: "The Large Language Model lacks the 'reasoning engine' capability to understand the database schema.", correct: false },
      { id: "d", text: "The developer failed to install a separate 'write_database' tool.", correct: false }
    ],
    explanation: "LLMs do not execute tools directly; they output structured requests (like JSON). A separate execution harness must intercept the request, run the tool, and crucially, feed the result back into the LLM so it can read the actual data and generate a response."
  },
  {
    id: "ext2-mcq-004", moduleId: "3", type: "multiple-choice", difficulty: "intermediate",
    prompt: "An engineering team wants to connect an AI agent to their proprietary CRM system, their Slack workspace, and a local file directory without writing custom integration code for every single combination of model and tool. Which architecture best solves this 'N by M integration problem'?",
    options: [
      { id: "a", text: "Deploying a massive monolithic LLM locally that has pre-trained knowledge of all three systems.", correct: false },
      { id: "b", text: "Implementing the Model Context Protocol (MCP) to standardize the connection between the AI and external data sources.", correct: true },
      { id: "c", text: "Using purely zero-shot execution without a dedicated scratchpad.", correct: false },
      { id: "d", text: "Relying exclusively on the 'First-In-First-Out' (FIFO) context limit strategy.", correct: false }
    ],
    explanation: "The Model Context Protocol (MCP) is an open standard that provides a universal translator between AI models and external tools or datasets, completely eliminating the need for brittle, custom-built integrations."
  },
  {
    id: "ext2-mcq-005", moduleId: "4", type: "multiple-choice", difficulty: "advanced",
    prompt: "When designing an autonomous agent system for managing cloud server infrastructure, the engineering team requires the agent to diagnose server issues, draft a remediation plan, and then execute terminal commands to fix the issues. To prevent the agent from accidentally deleting production data, which architectural control must be implemented?",
    options: [
      { id: "a", text: "A strictly enforced zero-shot prompt that commands the agent to 'never delete production data'.", correct: false },
      { id: "b", text: "A Human-in-the-Loop gate that pauses the execution loop immediately before the agent runs any destructive terminal command.", correct: true },
      { id: "c", text: "A larger context window that allows the agent to hold the entire server history in memory.", correct: false },
      { id: "d", text: "Upgrading the LLM to a newer version with a higher parameter count.", correct: false }
    ],
    explanation: "Prompt engineering alone cannot guarantee safety. True autonomy must be bounded by system-level controls. For high-stakes or destructive actions, the execution loop must enforce a Human-in-the-Loop (HITL) gate to pause and wait for explicit approval."
  },
  {
    id: "ext2-mcq-006", moduleId: "4", type: "multiple-choice", difficulty: "intermediate",
    prompt: "A developer notices their agent frequently hallucinates arguments when trying to use tools, often calling the tool incorrectly or misunderstanding the goal. The agent is currently using 'naive zero-shot execution'. Which framework should the developer implement to force the agent to catch its own logical flaws before acting?",
    options: [
      { id: "a", text: "Retrieval-Augmented Generation (RAG)", correct: false },
      { id: "b", text: "ReAct (Reason, then Act)", correct: true },
      { id: "c", text: "First-In-First-Out (FIFO) Queuing", correct: false },
      { id: "d", text: "Model Context Protocol (MCP)", correct: false }
    ],
    explanation: "ReAct (Reason, then Act) forces the model into an internal monologue. By thinking out loud in a scratchpad before taking action, the agent evaluates its own plan, significantly reducing hallucinations and tool misuse."
  },

  // ========================================================================
  // BATCH 3: Module 3 Intermediate & Final Quizzes
  // ========================================================================
  {
  "id": "m3-l1-001",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-l1"
  ],
  "prompt": "What is the primary purpose of 'Function Calling' (or 'Tool Calling') for a Large Language Model?",
  "options": [
    {
      "id": "a",
      "text": "To increase the parameter size of the model dynamically.",
      "correct": false
    },
    {
      "id": "b",
      "text": "To allow the LLM to output structured data (like JSON) indicating an external function should be executed.",
      "correct": true
    },
    {
      "id": "c",
      "text": "To directly execute Python code inside the neural network weights.",
      "correct": false
    },
    {
      "id": "d",
      "text": "To bypass context window limits by reading directly from a hard drive.",
      "correct": false
    }
  ],
  "explanation": "Function calling doesn't mean the LLM executes code itself. It means the LLM analyzes the prompt and generates a structured request (usually JSON), which an external harness then executes."
},
  {
  "id": "m3-l1-002",
  "moduleId": "3",
  "type": "multiple-select",
  "difficulty": "intermediate",
  "tags": [
    "m3-l1"
  ],
  "prompt": "Which of the following are steps in the standard Function Calling Execution Loop? Select all that apply.",
  "selectAllThatApply": true,
  "options": [
    {
      "id": "a",
      "text": "The LLM signals intent by generating a tool call.",
      "correct": true
    },
    {
      "id": "b",
      "text": "The execution harness runs the actual requested function.",
      "correct": true
    },
    {
      "id": "c",
      "text": "The model retrains itself on the function result.",
      "correct": false
    },
    {
      "id": "d",
      "text": "The harness feeds the result back into the LLM to generate the final answer.",
      "correct": true
    }
  ],
  "explanation": "The loop is: Intent (LLM) -> Execution (Harness) -> Feedback (Harness -> LLM). The model does not retrain itself during inference."
},
  {
  "id": "m3-l1-003",
  "moduleId": "3",
  "type": "fill-blank",
  "difficulty": "easy",
  "tags": [
    "m3-l1"
  ],
  "prompt": "By exposing filesystem read and write tools to an LLM, you are effectively giving the agent local ______.",
  "placeholder": "Type your answer here...",
  "acceptedAnswers": [
    "RAG",
    "retrieval augmented generation",
    "retrieval-augmented generation"
  ],
  "explanation": "Filesystem access acts as local RAG. The agent can dynamically read markdown files (like skills) to pull in context as needed, rather than loading everything upfront."
},
  {
  "id": "m3-l1-004",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "advanced",
  "tags": [
    "m3-l1"
  ],
  "prompt": "Why are code execution tools critical for LLMs when dealing with complex logic or math?",
  "options": [
    {
      "id": "a",
      "text": "LLMs cannot generate Python syntax natively.",
      "correct": false
    },
    {
      "id": "b",
      "text": "LLMs predict tokens based on probability, which makes them unreliable for precise deterministic math. Code execution delegates math to a deterministic engine.",
      "correct": true
    },
    {
      "id": "c",
      "text": "Code execution tools increase the model's temperature.",
      "correct": false
    },
    {
      "id": "d",
      "text": "They allow the LLM to compile its own neural weights.",
      "correct": false
    }
  ],
  "explanation": "LLMs are probabilistic. They guess the next token, which is bad for math. By writing a Python script and executing it, they delegate deterministic tasks to a true calculator."
},
  {
  "id": "m3-l1-005",
  "moduleId": "3",
  "type": "match-pairs",
  "difficulty": "intermediate",
  "tags": [
    "m3-l1"
  ],
  "prompt": "Match the tool category to its primary capability.",
  "pairs": [
    {
      "left": "Filesystem Tools",
      "right": "Local context retrieval and document rewriting"
    },
    {
      "left": "Code Interpreter",
      "right": "Flawless mathematical and logical execution"
    },
    {
      "left": "Web Search Tools",
      "right": "Fetching real-time or post-training data"
    }
  ],
  "explanation": "Filesystems act as local RAG, interpreters solve the LLM math problem, and web search grounds the model in current events."
},
  {
  "id": "m3-l1-006",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-l1"
  ],
  "prompt": "When an LLM decides to use a tool, what is actually communicating with the external API or file system?",
  "options": [
    {
      "id": "a",
      "text": "The LLM's internal weights",
      "correct": false
    },
    {
      "id": "b",
      "text": "The Execution Harness (e.g., Cursor, Antigravity)",
      "correct": true
    },
    {
      "id": "c",
      "text": "The Vector Database",
      "correct": false
    },
    {
      "id": "d",
      "text": "The Tokenizer",
      "correct": false
    }
  ],
  "explanation": "The LLM only generates text (the JSON tool call). The external application (the harness) intercepts that JSON and actually performs the read/write or API call."
},
  {
  "id": "m3-l1-007",
  "moduleId": "3",
  "type": "multiple-select",
  "difficulty": "advanced",
  "tags": [
    "m3-l1"
  ],
  "prompt": "Which of the following are valid reasons for maintaining architectural separation between the LLM and the execution harness?",
  "selectAllThatApply": true,
  "options": [
    {
      "id": "a",
      "text": "It allows human-in-the-loop approvals before irreversible actions occur.",
      "correct": true
    },
    {
      "id": "b",
      "text": "It prevents the model from hallucinating file deletions directly on the hardware.",
      "correct": true
    },
    {
      "id": "c",
      "text": "It reduces the amount of RAM needed to run the LLM.",
      "correct": false
    },
    {
      "id": "d",
      "text": "It isolates network credentials in the harness, keeping them out of the LLM prompt.",
      "correct": true
    }
  ],
  "explanation": "Separation of concerns is a vital security pattern. It prevents the model from taking autonomous destructive actions without permission and protects secrets."
},
  {
  "id": "m3-l1-008",
  "moduleId": "3",
  "type": "fill-blank",
  "difficulty": "intermediate",
  "tags": [
    "m3-l1"
  ],
  "prompt": "A raw AI without tools is like a brain trapped in a jar. It requires a ______ to interact with the outside world.",
  "placeholder": "Type your answer here...",
  "acceptedAnswers": [
    "toolbelt",
    "harness"
  ],
  "explanation": "The 'toolbelt' or 'harness' provides the APIs and functions the AI needs to take action."
},
  {
  "id": "m3-l1-009",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "foundational",
  "tags": [
    "m3-l1"
  ],
  "prompt": "True or False: LLMs can natively execute a bash command simply by reading a prompt that says 'run ls -la'.",
  "options": [
    {
      "id": "a",
      "text": "True",
      "correct": false
    },
    {
      "id": "b",
      "text": "False",
      "correct": true
    }
  ],
  "explanation": "False. LLMs only output text. The harness must be explicitly programmed to recognize a tool call, execute 'ls -la', and return the result."
},
  {
  "id": "m3-l1-010",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-l1"
  ],
  "prompt": "What happens if a tool returns a massive error log that exceeds the model's remaining context window?",
  "options": [
    {
      "id": "a",
      "text": "The model gracefully compresses the log.",
      "correct": false
    },
    {
      "id": "b",
      "text": "The context window overflows, causing the API request to fail or truncating important previous instructions.",
      "correct": true
    },
    {
      "id": "c",
      "text": "The model automatically switches to a larger context version of itself.",
      "correct": false
    },
    {
      "id": "d",
      "text": "The tool execution is rolled back.",
      "correct": false
    }
  ],
  "explanation": "Tool outputs consume tokens just like any other text. A massive log will blow out the context window, causing truncation or an API error."
},
  {
  "id": "m3-l2-001",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-l2"
  ],
  "prompt": "Before the Model Context Protocol (MCP), integrating 5 models with 5 tools required 25 custom integrations. This is known as the:",
  "options": [
    {
      "id": "a",
      "text": "N + M solution",
      "correct": false
    },
    {
      "id": "b",
      "text": "N x M integration problem",
      "correct": true
    },
    {
      "id": "c",
      "text": "Context collapse problem",
      "correct": false
    },
    {
      "id": "d",
      "text": "Goldfish problem",
      "correct": false
    }
  ],
  "explanation": "The N x M integration problem describes the chaos of proprietary integrations. MCP solves this by introducing a standard protocol (N + M)."
},
  {
  "id": "m3-l2-002",
  "moduleId": "3",
  "type": "fill-blank",
  "difficulty": "easy",
  "tags": [
    "m3-l2"
  ],
  "prompt": "Think of MCP as the ______ port for AI; it allows any model to securely connect to any external data source using one standardized plug.",
  "placeholder": "Type your answer here...",
  "acceptedAnswers": [
    "USB-C",
    "USBC",
    "usb-c",
    "usb c"
  ],
  "explanation": "MCP is frequently compared to USB-C because it provides a universal, standardized connection interface for AI models and external tools."
},
  {
  "id": "m3-l2-003",
  "moduleId": "3",
  "type": "multiple-select",
  "difficulty": "intermediate",
  "tags": [
    "m3-l2"
  ],
  "prompt": "An MCP Server exposes three main capabilities to an LLM. What are they? Select all that apply.",
  "selectAllThatApply": true,
  "options": [
    {
      "id": "a",
      "text": "Resources (context/file contents)",
      "correct": true
    },
    {
      "id": "b",
      "text": "Prompts (reusable templates)",
      "correct": true
    },
    {
      "id": "c",
      "text": "Tools (executable functions)",
      "correct": true
    },
    {
      "id": "d",
      "text": "Weights (neural parameters)",
      "correct": false
    }
  ],
  "explanation": "MCP standardizes Resources, Prompts, and Tools. It does not deal with neural weights."
},
  {
  "id": "m3-l2-004",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "advanced",
  "tags": [
    "m3-l2"
  ],
  "prompt": "In the MCP architecture, which component is responsible for initiating the connection and sending requests?",
  "options": [
    {
      "id": "a",
      "text": "The MCP Server",
      "correct": false
    },
    {
      "id": "b",
      "text": "The MCP Client (running inside the AI application)",
      "correct": true
    },
    {
      "id": "c",
      "text": "The LLM Provider (e.g., OpenAI servers)",
      "correct": false
    },
    {
      "id": "d",
      "text": "The Vector Database",
      "correct": false
    }
  ],
  "explanation": "The AI application (like Antigravity or Claude Desktop) runs an MCP Client, which speaks the protocol to an external MCP Server."
},
  {
  "id": "m3-l2-005",
  "moduleId": "3",
  "type": "match-pairs",
  "difficulty": "intermediate",
  "tags": [
    "m3-l2"
  ],
  "prompt": "Match the MCP capability with its correct description.",
  "pairs": [
    {
      "left": "Resources",
      "right": "Read-only context like file contents or database rows"
    },
    {
      "left": "Tools",
      "right": "Executable actions like writing a file or sending an API request"
    },
    {
      "left": "Prompts",
      "right": "Pre-configured templates that the AI can invoke"
    }
  ],
  "explanation": "Resources provide data, Tools provide actions, and Prompts provide reusable instructions."
},
  {
  "id": "m3-l2-006",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "easy",
  "tags": [
    "m3-l2"
  ],
  "prompt": "Which of the following is a key benefit of the MCP open standard?",
  "options": [
    {
      "id": "a",
      "text": "It forces you to write custom integration code for every new LLM that comes out.",
      "correct": false
    },
    {
      "id": "b",
      "text": "You can pull pre-built servers from community registries instead of building plumbing from scratch.",
      "correct": true
    },
    {
      "id": "c",
      "text": "It completely replaces the need for context windows.",
      "correct": false
    },
    {
      "id": "d",
      "text": "It makes local models run twice as fast.",
      "correct": false
    }
  ],
  "explanation": "Because it's an open standard, developers can share MCP servers. Once a Slack MCP server is built, it works with any MCP-compliant client immediately."
},
  {
  "id": "m3-l2-007",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-l2"
  ],
  "prompt": "Which platforms were mentioned as powerful directories for finding pre-built MCP servers?",
  "options": [
    {
      "id": "a",
      "text": "Smithery.ai, MCP.so, and Glama.ai",
      "correct": true
    },
    {
      "id": "b",
      "text": "NPM and PyPI",
      "correct": false
    },
    {
      "id": "c",
      "text": "AWS and Azure Marketplaces",
      "correct": false
    },
    {
      "id": "d",
      "text": "Docker Hub exclusively",
      "correct": false
    }
  ],
  "explanation": "Smithery, MCP.so, and Glama are dedicated community registries that index thousands of MCP servers."
},
  {
  "id": "m3-l2-008",
  "moduleId": "3",
  "type": "multiple-select",
  "difficulty": "intermediate",
  "tags": [
    "m3-l2"
  ],
  "prompt": "With MCP, which of the following connections become standardized and reusable across different AI harnesses? Select all that apply.",
  "selectAllThatApply": true,
  "options": [
    {
      "id": "a",
      "text": "Querying a local PostgreSQL database",
      "correct": true
    },
    {
      "id": "b",
      "text": "Pulling code from GitHub",
      "correct": true
    },
    {
      "id": "c",
      "text": "Sending messages in Slack",
      "correct": true
    },
    {
      "id": "d",
      "text": "Searching the web via Brave",
      "correct": true
    }
  ],
  "explanation": "All of these are common MCP servers. The protocol standardizes the connection to *any* external service."
},
  {
  "id": "m3-l2-009",
  "moduleId": "3",
  "type": "fill-blank",
  "difficulty": "advanced",
  "tags": [
    "m3-l2"
  ],
  "prompt": "If a new frontier model is released tomorrow (e.g., GPT-5), how many custom API integrations do you need to write to connect it to your existing Postgres MCP server, assuming the client harness supports MCP?",
  "placeholder": "Type a number...",
  "acceptedAnswers": [
    "0",
    "zero",
    "none"
  ],
  "explanation": "Zero. Because the client harness speaks MCP, any new model plugged into the harness immediately gains access to all your existing MCP servers without code changes."
},
  {
  "id": "m3-l2-010",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "foundational",
  "tags": [
    "m3-l2"
  ],
  "prompt": "MCP is fundamentally a: ",
  "options": [
    {
      "id": "a",
      "text": "Hardware specification",
      "correct": false
    },
    {
      "id": "b",
      "text": "Proprietary algorithm owned by OpenAI",
      "correct": false
    },
    {
      "id": "c",
      "text": "Client-Server protocol",
      "correct": true
    },
    {
      "id": "d",
      "text": "New programming language",
      "correct": false
    }
  ],
  "explanation": "MCP is an open client-server protocol (originally spearheaded by Anthropic but fully open source)."
},
  {
  "id": "m3-l3-001",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-l3"
  ],
  "prompt": "What is the primary purpose of placing an AGENTS.md file in the root of your repository?",
  "options": [
    {
      "id": "a",
      "text": "To serve as a standard Readme for human developers.",
      "correct": false
    },
    {
      "id": "b",
      "text": "To provide the agent with global coding standards, boundaries, and architectural context every time it opens the folder.",
      "correct": true
    },
    {
      "id": "c",
      "text": "To store API keys securely.",
      "correct": false
    },
    {
      "id": "d",
      "text": "To list the NPM dependencies.",
      "correct": false
    }
  ],
  "explanation": "AGENTS.md acts as a project-level system prompt. It tells the agent the rules of the repo before it writes a single line of code."
},
  {
  "id": "m3-l3-002",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "advanced",
  "tags": [
    "m3-l3"
  ],
  "prompt": "Why are targeted skill documents (e.g., 'Frontend Design Skill') preferred over putting every single instruction into AGENTS.md?",
  "options": [
    {
      "id": "a",
      "text": "Because AGENTS.md only supports plain text, not markdown.",
      "correct": false
    },
    {
      "id": "b",
      "text": "To preserve a Clean Context. The agent reads the specific skill file only when executing that specific task, saving tokens and reducing noise.",
      "correct": true
    },
    {
      "id": "c",
      "text": "Because skills run faster than AGENTS.md.",
      "correct": false
    },
    {
      "id": "d",
      "text": "To bypass the local harness entirely.",
      "correct": false
    }
  ],
  "explanation": "Modular skills prevent context bloat. You don't need database migration rules polluting the context window when you are designing a CSS button."
},
  {
  "id": "m3-l3-003",
  "moduleId": "3",
  "type": "multiple-select",
  "difficulty": "intermediate",
  "tags": [
    "m3-l3"
  ],
  "prompt": "How can you categorize modular skills in a professional project? Select all that apply.",
  "selectAllThatApply": true,
  "options": [
    {
      "id": "a",
      "text": "By Workflow (e.g., 'Code Review Skill')",
      "correct": true
    },
    {
      "id": "b",
      "text": "By Expert Persona (e.g., 'Senior DB Architect')",
      "correct": true
    },
    {
      "id": "c",
      "text": "By Neural Weight configuration",
      "correct": false
    },
    {
      "id": "d",
      "text": "By Context/Domain (e.g., 'Frontend Animation Standards')",
      "correct": true
    }
  ],
  "explanation": "Skills are typically organized around workflows, expert personas, or domain contexts. They do not alter neural weights."
},
  {
  "id": "m3-l3-004",
  "moduleId": "3",
  "type": "fill-blank",
  "difficulty": "intermediate",
  "tags": [
    "m3-l3"
  ],
  "prompt": "A skill designed solely to analyze your workflow and generate new skills on the fly is known as a ______-Skill.",
  "placeholder": "Type your answer here...",
  "acceptedAnswers": [
    "Meta",
    "meta",
    "Meta-skill",
    "meta-skill"
  ],
  "explanation": "Meta-skills are the ultimate leverage. They teach the AI how to write new instructions for itself."
},
  {
  "id": "m3-l3-005",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "foundational",
  "tags": [
    "m3-l3"
  ],
  "prompt": "Which of the following directories are community-curated goldmines for finding pre-written skills?",
  "options": [
    {
      "id": "a",
      "text": "skills.sh and cursor.directory",
      "correct": true
    },
    {
      "id": "b",
      "text": "Docker Hub",
      "correct": false
    },
    {
      "id": "c",
      "text": "AWS Marketplace",
      "correct": false
    },
    {
      "id": "d",
      "text": "React documentation",
      "correct": false
    }
  ],
  "explanation": "skills.sh and cursor.directory host community-driven markdown skills you can instantly drop into your projects."
},
  {
  "id": "m3-l3-006",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "advanced",
  "tags": [
    "m3-l3"
  ],
  "prompt": "To actually trigger a targeted skill reliably, you must 'enrich' your prompts. What does this mean in practice?",
  "options": [
    {
      "id": "a",
      "text": "Paying for a higher tier API key.",
      "correct": false
    },
    {
      "id": "b",
      "text": "Explicitly instructing the agent to 'use the [Skill Name] skill' in your initial prompt.",
      "correct": true
    },
    {
      "id": "c",
      "text": "Converting the skill to Python code.",
      "correct": false
    },
    {
      "id": "d",
      "text": "Injecting the skill into the global environment variables.",
      "correct": false
    }
  ],
  "explanation": "Agents won't always guess which file to read. By enriching the prompt ('use the frontend design skill to build a component'), you guarantee the agent uses local RAG to read the rules first."
},
  {
  "id": "m3-l3-007",
  "moduleId": "3",
  "type": "match-pairs",
  "difficulty": "intermediate",
  "tags": [
    "m3-l3"
  ],
  "prompt": "Match the context layer to its scope.",
  "pairs": [
    {
      "left": "AGENTS.md",
      "right": "Global rules applied to every interaction in the repo"
    },
    {
      "left": "Targeted Skill File",
      "right": "Modular rules applied only when performing a specific task"
    },
    {
      "left": "Enriched User Prompt",
      "right": "The immediate instruction that triggers the workflow"
    }
  ],
  "explanation": "AGENTS.md is global, Skills are modular, and the Enriched Prompt is the trigger."
},
  {
  "id": "m3-l3-008",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-l3"
  ],
  "prompt": "If an agent generates a React component that uses generic colors instead of your brand's strict Tailwind palette, what is the most likely architectural failure?",
  "options": [
    {
      "id": "a",
      "text": "The agent was not prompted to read the Frontend Design Skill before acting.",
      "correct": true
    },
    {
      "id": "b",
      "text": "The agent is too small to understand React.",
      "correct": false
    },
    {
      "id": "c",
      "text": "The agent's MCP server crashed.",
      "correct": false
    },
    {
      "id": "d",
      "text": "The agent hallucinates brand colors inherently.",
      "correct": false
    }
  ],
  "explanation": "Because of The Goldfish Problem, if you don't force the agent to read the specific design skill containing your palette, it will default to generic AI training data."
},
  {
  "id": "m3-l3-009",
  "moduleId": "3",
  "type": "multiple-select",
  "difficulty": "advanced",
  "tags": [
    "m3-l3"
  ],
  "prompt": "What are the benefits of digitizing your own subject matter expertise into a skill file? Select all that apply.",
  "selectAllThatApply": true,
  "options": [
    {
      "id": "a",
      "text": "It codifies your mental models for the AI to replicate.",
      "correct": true
    },
    {
      "id": "b",
      "text": "It eliminates the need for you to repeatedly type out the same complex instructions.",
      "correct": true
    },
    {
      "id": "c",
      "text": "It allows junior team members to execute tasks at a senior level using your 'persona'.",
      "correct": true
    },
    {
      "id": "d",
      "text": "It prevents the AI from using tokens.",
      "correct": false
    }
  ],
  "explanation": "Codifying expertise into reusable markdown skills scales your capabilities, saves typing, and empowers the rest of the team."
},
  {
  "id": "m3-l3-010",
  "moduleId": "3",
  "type": "fill-blank",
  "difficulty": "easy",
  "tags": [
    "m3-l3"
  ],
  "prompt": "Keeping world-class markdown documentation in your project folder transforms a generic LLM assistant into a specialized ______ member.",
  "placeholder": "Type your answer here...",
  "acceptedAnswers": [
    "team"
  ],
  "explanation": "Context is everything. Providing deep project context turns a generic tool into a specialized team member."
},
  {
  "id": "m3-final-001",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-final"
  ],
  "prompt": "In an agentic system, the AI itself does not execute code or browse the web. Which component is responsible for actually performing the actions?",
  "options": [
    {
      "id": "a",
      "text": "The Execution Harness",
      "correct": true
    },
    {
      "id": "b",
      "text": "The Vector Database",
      "correct": false
    },
    {
      "id": "c",
      "text": "The Foundation Model",
      "correct": false
    },
    {
      "id": "d",
      "text": "The Tokenizer",
      "correct": false
    }
  ],
  "explanation": "The AI generates structured JSON intent (tool calls), but the Execution Harness (e.g., your CLI or desktop app) runs the actual code."
},
  {
  "id": "m3-final-002",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "advanced",
  "tags": [
    "m3-final"
  ],
  "prompt": "Why is the Model Context Protocol (MCP) considered a massive leap forward for AI development?",
  "options": [
    {
      "id": "a",
      "text": "It increases model parameter counts.",
      "correct": false
    },
    {
      "id": "b",
      "text": "It completely eliminates hallucinations.",
      "correct": false
    },
    {
      "id": "c",
      "text": "It replaces chaotic, custom API integrations with a single, open standard client-server architecture.",
      "correct": true
    },
    {
      "id": "d",
      "text": "It allows models to train themselves without GPUs.",
      "correct": false
    }
  ],
  "explanation": "MCP standardizes the 'plug' between AI applications and external data sources, eliminating the N x M integration problem."
},
  {
  "id": "m3-final-003",
  "moduleId": "3",
  "type": "multiple-select",
  "difficulty": "intermediate",
  "tags": [
    "m3-final"
  ],
  "prompt": "What are the core components exposed by an MCP Server? Select all that apply.",
  "selectAllThatApply": true,
  "options": [
    {
      "id": "a",
      "text": "Resources",
      "correct": true
    },
    {
      "id": "b",
      "text": "Tools",
      "correct": true
    },
    {
      "id": "c",
      "text": "Prompts",
      "correct": true
    },
    {
      "id": "d",
      "text": "Embeddings",
      "correct": false
    }
  ],
  "explanation": "An MCP server provides Resources (context), Tools (actions), and Prompts (templates). It does not provide embeddings directly."
},
  {
  "id": "m3-final-004",
  "moduleId": "3",
  "type": "fill-blank",
  "difficulty": "intermediate",
  "tags": [
    "m3-final"
  ],
  "prompt": "A document placed at the root of a project to provide global rules, architectural standards, and boundaries to the AI agent is typically named ______.",
  "placeholder": "Filename (e.g., something.md)",
  "acceptedAnswers": [
    "AGENTS.md",
    "agents.md"
  ],
  "explanation": "AGENTS.md is the industry standard convention for providing repository-level instructions to AI harnesses."
},
  {
  "id": "m3-final-005",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-final"
  ],
  "prompt": "What is the primary advantage of breaking instructions into modular 'skills' instead of putting everything into AGENTS.md?",
  "options": [
    {
      "id": "a",
      "text": "It saves storage space on your hard drive.",
      "correct": false
    },
    {
      "id": "b",
      "text": "It preserves a Clean Context, preventing context limit exhaustion and reducing hallucination by only loading rules relevant to the immediate task.",
      "correct": true
    },
    {
      "id": "c",
      "text": "It allows the skills to be compiled into binary code.",
      "correct": false
    },
    {
      "id": "d",
      "text": "It overrides the model's base training.",
      "correct": false
    }
  ],
  "explanation": "Loading too many irrelevant instructions causes 'The Goldfish Problem' and 'Lost in the Middle' errors. Modular skills keep the context clean."
},
  {
  "id": "m3-final-006",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "advanced",
  "tags": [
    "m3-final"
  ],
  "prompt": "When dealing with high-stakes tool execution (e.g., merging a PR, dropping a database table), what safeguard must the execution harness enforce?",
  "options": [
    {
      "id": "a",
      "text": "A maximum token limit.",
      "correct": false
    },
    {
      "id": "b",
      "text": "Human-in-the-loop (HITL) checkpoints to manually authorize the action.",
      "correct": true
    },
    {
      "id": "c",
      "text": "Lowering the temperature parameter to 0.",
      "correct": false
    },
    {
      "id": "d",
      "text": "Increasing the Top-P parameter.",
      "correct": false
    }
  ],
  "explanation": "Tool calling enables destructive real-world actions. A Human-in-the-Loop check is mandatory for irreversible operations."
},
  {
  "id": "m3-final-007",
  "moduleId": "3",
  "type": "match-pairs",
  "difficulty": "advanced",
  "tags": [
    "m3-final"
  ],
  "prompt": "Match the concept to its primary function in an agentic toolbelt.",
  "pairs": [
    {
      "left": "MCP Client",
      "right": "Runs inside the harness to standardized requests"
    },
    {
      "left": "AGENTS.md",
      "right": "Provides project-wide system prompts and boundaries"
    },
    {
      "left": "Targeted Skill",
      "right": "Provides context for a specific, isolated task"
    },
    {
      "left": "Code Interpreter Tool",
      "right": "Bypasses the probabilistic nature of LLM math"
    }
  ],
  "explanation": "These four elements form the backbone of a professional AI toolbelt."
},
  {
  "id": "m3-final-008",
  "moduleId": "3",
  "type": "multiple-choice",
  "difficulty": "intermediate",
  "tags": [
    "m3-final"
  ],
  "prompt": "How does an agent locate a targeted skill (like a frontend design skill) when processing a request?",
  "options": [
    {
      "id": "a",
      "text": "It is hardcoded into the model's weights.",
      "correct": false
    },
    {
      "id": "b",
      "text": "It uses a filesystem read tool to dynamically fetch the file via local RAG, usually guided by an 'enriched' prompt.",
      "correct": true
    },
    {
      "id": "c",
      "text": "It searches Google for the skill.",
      "correct": false
    },
    {
      "id": "d",
      "text": "It downloads it from Smithery on every request.",
      "correct": false
    }
  ],
  "explanation": "Local RAG allows the harness to read the skill markdown file dynamically from the filesystem when the prompt instructs it to do so."
},
  {
  "id": "m3-final-009",
  "moduleId": "3",
  "type": "multiple-select",
  "difficulty": "intermediate",
  "tags": [
    "m3-final"
  ],
  "prompt": "Which of the following represent true 'action' capabilities provided by tools, distinguishing an agent from a pure chat interface? Select all that apply.",
  "selectAllThatApply": true,
  "options": [
    {
      "id": "a",
      "text": "Reading and writing files to a local directory.",
      "correct": true
    },
    {
      "id": "b",
      "text": "Generating poetry.",
      "correct": false
    },
    {
      "id": "c",
      "text": "Querying a live external database via MCP.",
      "correct": true
    },
    {
      "id": "d",
      "text": "Executing Python scripts in a sandbox.",
      "correct": true
    }
  ],
  "explanation": "Action implies affecting or reading from the external world (files, databases, code execution). Generating poetry is purely text generation."
},
  {
  "id": "m3-final-010",
  "moduleId": "3",
  "type": "fill-blank",
  "difficulty": "advanced",
  "tags": [
    "m3-final"
  ],
  "prompt": "A ______-skill is a highly leveraged document designed to teach the AI how to generate new skills based on your workflow.",
  "placeholder": "Type your answer here...",
  "acceptedAnswers": [
    "meta",
    "Meta"
  ],
  "explanation": "Meta-skills analyze your subject matter expertise and write other markdown skill documents automatically."
},
];
