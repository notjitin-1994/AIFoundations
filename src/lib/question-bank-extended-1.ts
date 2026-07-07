import { Question } from "./question-bank";

export const EXTENDED_BANK_1: Question[] = [
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
    explanation: "Because the market is highly dynamic, organizations should adopt a framework that supports multiple approved tools rather than permanently locking into a single vendor's UI."
  }
];
