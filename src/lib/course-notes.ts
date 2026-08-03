export type CourseNote = {
  moduleId: string;
  lessonIndex: number;
  slideIndex: number;
  content: string;
  id?: string;
  title?: string;
};

export const COURSE_NOTES: CourseNote[] = [
  {
    moduleId: "1",
    lessonIndex: 0,
    slideIndex: 0,
    id: "m1-title",
    title: "Title",
    content: `### Title

**Instructional Focus:**
> Welcome to Module 1: The Intelligence Illusion. Before we can effectively use Generative AI, we must demystify it. We must dismantle the notion that Large Language Models 'think' like humans, revealing them instead as highly sophisticated prediction engines. They are not a knowledge base; they don't...

**Learning Objectives:**
- Deconstruct the anthropomorphic view of AI (the 'Hollywood' myth).
- Identify AI as highly sophisticated statistical prediction engines.
- Shift mindset from 'talking to a human' to 'programming a probability matrix'.
`
  },
  {
    moduleId: "1",
    lessonIndex: 0,
    slideIndex: 1,
    id: "m1-video-whatis",
    title: "Video Whatis",
    content: `### Video Whatis

**Instructional Focus:**
> To break the intelligence illusion, we first need a shared understanding of how these models operate under the hood. This primer from Google Cloud Tech provides the perfect technical foundation. Please watch it before we continue.

**Learning Objectives:**
- Deconstruct the anthropomorphic view of AI (the 'Hollywood' myth).
- Identify AI as highly sophisticated statistical prediction engines.
- Shift mindset from 'talking to a human' to 'programming a probability matrix'.
`
  },
  {
    moduleId: "1",
    lessonIndex: 0,
    slideIndex: 2,
    id: "m1-timeline",
    title: "Timeline",
    content: `### Timeline

**Instructional Focus:**
> 

**Learning Objectives:**
- Deconstruct the anthropomorphic view of AI (the 'Hollywood' myth).
- Identify AI as highly sophisticated statistical prediction engines.
- Shift mindset from 'talking to a human' to 'programming a probability matrix'.
`
  },
  {
    moduleId: "1",
    lessonIndex: 0,
    slideIndex: 3,
    id: "m1-hollywood",
    title: "Hollywood",
    content: `### Hollywood

**Instructional Focus:**
> It's critical to separate the Hollywood fantasy from reality. On one hand, we have Artificial General Intelligence, or AGI. In movies, this is depicted as sentient and self-aware, possessing human-like reasoning, and capable of performing any intellectual task. Currently, this remains science fictio...

**Learning Objectives:**
- Deconstruct the anthropomorphic view of AI (the 'Hollywood' myth).
- Identify AI as highly sophisticated statistical prediction engines.
- Shift mindset from 'talking to a human' to 'programming a probability matrix'.
`
  },
  {
    moduleId: "1",
    lessonIndex: 0,
    slideIndex: 4,
    id: "m1-assessment-1",
    title: "Assessment 1",
    content: `### Assessment 1

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Deconstruct the anthropomorphic view of AI (the 'Hollywood' myth).
- Identify AI as highly sophisticated statistical prediction engines.
- Shift mindset from 'talking to a human' to 'programming a probability matrix'.
`
  },
  {
    moduleId: "1",
    lessonIndex: 1,
    slideIndex: 5,
    id: "m1-ml-intro",
    title: "Ml Intro",
    content: `### Ml Intro

**Instructional Focus:**
> Instead of programming explicit rules, we give machines data and let them discover the patterns themselves through three main approaches. This is the foundation of Machine Learning. It shifts the paradigm from writing code that solves a problem, to writing code that learns how to solve a problem by ...

**Learning Objectives:**
- Trace the evolution of machine learning through neural networks.
- Differentiate between standard ML, deep learning, and transformer architectures.
- Understand how the transformer architecture enables modern LLMs.
`
  },
  {
    moduleId: "1",
    lessonIndex: 1,
    slideIndex: 6,
    id: "m1-ml-supervised",
    title: "Ml Supervised",
    content: `### Ml Supervised

**Instructional Focus:**
> The first approach is Supervised Learning. Think of this as the Classroom with an Answer Key. The model is given a dataset where every example is clearly labeled—like teaching a child with flashcards: 'This is a cat', 'This is a dog'. The machine learns to map the inputs to the known outputs, allowi...

**Learning Objectives:**
- Trace the evolution of machine learning through neural networks.
- Differentiate between standard ML, deep learning, and transformer architectures.
- Understand how the transformer architecture enables modern LLMs.
`
  },
  {
    moduleId: "1",
    lessonIndex: 1,
    slideIndex: 7,
    id: "m1-ml-unsupervised",
    title: "Ml Unsupervised",
    content: `### Ml Unsupervised

**Instructional Focus:**
> The second approach is Unsupervised Learning. Imagine you are a Library Archeologist handed a massive pile of uncategorized, disorganized documents with no labels or answer key. Your job is to read through them and identify similarities to group them into logical clusters. This is exactly what the A...

**Learning Objectives:**
- Trace the evolution of machine learning through neural networks.
- Differentiate between standard ML, deep learning, and transformer architectures.
- Understand how the transformer architecture enables modern LLMs.
`
  },
  {
    moduleId: "1",
    lessonIndex: 1,
    slideIndex: 8,
    id: "m1-ml-reinforcement",
    title: "Ml Reinforcement",
    content: `### Ml Reinforcement

**Instructional Focus:**
> The third approach is Reinforcement Learning. This is the Trial-and-Error Apprentice. The AI interacts with an environment and receives feedback in the form of rewards for good actions, or penalties for bad ones—much like training a dog with treats. Over thousands of iterations, the model learns the...

**Learning Objectives:**
- Trace the evolution of machine learning through neural networks.
- Differentiate between standard ML, deep learning, and transformer architectures.
- Understand how the transformer architecture enables modern LLMs.
`
  },
  {
    moduleId: "1",
    lessonIndex: 1,
    slideIndex: 9,
    id: "m1-neural-networks",
    title: "Neural Networks",
    content: `### Neural Networks

**Instructional Focus:**
> To bridge the gap between simple machine learning and advanced language models, we must understand Deep Learning. Deep Learning uses Artificial Neural Networks—layers of interconnected nodes inspired by the human brain. Data passes through these layers, where millions or even billions of adjustable ...

**Learning Objectives:**
- Trace the evolution of machine learning through neural networks.
- Differentiate between standard ML, deep learning, and transformer architectures.
- Understand how the transformer architecture enables modern LLMs.
`
  },
  {
    moduleId: "1",
    lessonIndex: 1,
    slideIndex: 10,
    id: "m1-generative-ai",
    title: "Generative Ai",
    content: `### Generative Ai

**Instructional Focus:**
> How do these neural networks actually understand and generate text? The breakthrough came with the Transformer architecture. Instead of reading words one by one in order, the Transformer uses an 'attention mechanism' to look at the entire sequence of words simultaneously. It learns which words are c...

**Learning Objectives:**
- Trace the evolution of machine learning through neural networks.
- Differentiate between standard ML, deep learning, and transformer architectures.
- Understand how the transformer architecture enables modern LLMs.
`
  },
  {
    moduleId: "1",
    lessonIndex: 1,
    slideIndex: 11,
    id: "m1-next-token",
    title: "Next Token",
    content: `### Next Token

**Instructional Focus:**
> At its absolute core, an AI like ChatGPT does not think; it predicts. It is a highly sophisticated probability engine running Next-Token Prediction. When you give it a prompt, it calculates the mathematical probability of what the very next fragment of a word—a token—should be. It selects it, adds i...

**Learning Objectives:**
- Trace the evolution of machine learning through neural networks.
- Differentiate between standard ML, deep learning, and transformer architectures.
- Understand how the transformer architecture enables modern LLMs.
`
  },
  {
    moduleId: "1",
    lessonIndex: 2,
    slideIndex: 12,
    id: "m1-llm-vs-slm",
    title: "Llm Vs Slm",
    content: `### Llm Vs Slm

**Instructional Focus:**
> Not all models need to know everything. Let's compare Large Language Models with Small Language Models. LLMs, like GPT-5.6 or Claude Sonnet 5, are massive models with hundreds of billions of parameters. They require entire data centers to run. They have vast knowledge breadth, but computing costs ar...

**Learning Objectives:**
- Distinguish between Large Language Models (LLMs) and Small Language Models (SLMs).
- Evaluate the cost, privacy, and performance tradeoffs between local and cloud AI.
- Determine the appropriate model class for specific project requirements.
`
  },
  {
    moduleId: "1",
    lessonIndex: 2,
    slideIndex: 13,
    id: "m1-ml-dnn-llm-assessment",
    title: "Ml Dnn Llm Assessment",
    content: `### Ml Dnn Llm Assessment

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Distinguish between Large Language Models (LLMs) and Small Language Models (SLMs).
- Evaluate the cost, privacy, and performance tradeoffs between local and cloud AI.
- Determine the appropriate model class for specific project requirements.
`
  },
  {
    moduleId: "1",
    lessonIndex: 3,
    slideIndex: 14,
    id: "m1-anatomy",
    title: "Anatomy",
    content: `### Anatomy

**Instructional Focus:**
> How do we communicate with these models? We use Prompt Engineering to guide the context window. A perfect prompt typically has four anatomical parts. First, the Role: setting the persona, like 'You are an expert instructional designer.' This heavily weights the statistical model towards vocabulary a...

**Learning Objectives:**
- Deconstruct prompt engineering into its four core anatomical parts: Persona, Task, Context, Constraints.
- Apply constraints to narrow the model's output variance.
- Design deterministic prompts that yield reliable outputs for your workflow.
`
  },
  {
    moduleId: "1",
    lessonIndex: 4,
    slideIndex: 15,
    id: "m1-hallucination",
    title: "Hallucination",
    content: `### Hallucination

**Instructional Focus:**
> Because models are just predicting the next most likely token, they can sometimes invent facts entirely. We call this a hallucination. For example, if you ask 'What is the population of Mars?', an AI might respond: 'The current population of Mars is approximately 4,200 research scientists and engine...

**Learning Objectives:**
- Analyze why hallucinations are an inherent feature of generative prediction, not a 'bug'.
- Identify how systemic bias in training data manifests in AI outputs.
- Implement verification and grounding techniques to mitigate hallucinations and bias.
`
  },
  {
    moduleId: "1",
    lessonIndex: 4,
    slideIndex: 16,
    id: "m1-bias",
    title: "Bias",
    content: `### Bias

**Instructional Focus:**
> AI models learn from human data, making them a mirror of our systemic flaws. If the internet training data contains historical biases—like 'The CEO walked into his office' or 'The nurse checked her patient'—the model will reproduce them. When you prompt the trained AI to write a story about a CEO an...

**Learning Objectives:**
- Analyze why hallucinations are an inherent feature of generative prediction, not a 'bug'.
- Identify how systemic bias in training data manifests in AI outputs.
- Implement verification and grounding techniques to mitigate hallucinations and bias.
`
  },
  {
    moduleId: "1",
    lessonIndex: 4,
    slideIndex: 17,
    id: "m1-quiz",
    title: "Quiz",
    content: `### Quiz

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Analyze why hallucinations are an inherent feature of generative prediction, not a 'bug'.
- Identify how systemic bias in training data manifests in AI outputs.
- Implement verification and grounding techniques to mitigate hallucinations and bias.
`
  },
  {
    moduleId: "1",
    lessonIndex: 4,
    slideIndex: 18,
    id: "m1-project-application",
    title: "Project Application",
    content: `### Project Application

**Instructional Focus:**
> You've proven your knowledge — now let's apply it. Using the four-part prompt anatomy you learned — Role, Task, Context, and Constraints — write a real prompt for your chosen project. Choose the right temperature setting for your use case, and identify the hallucination risk you need to watch for. T...

**Learning Objectives:**
- Analyze why hallucinations are an inherent feature of generative prediction, not a 'bug'.
- Identify how systemic bias in training data manifests in AI outputs.
- Implement verification and grounding techniques to mitigate hallucinations and bias.
`
  },
  {
    moduleId: "2",
    lessonIndex: 0,
    slideIndex: 0,
    id: "m2-title",
    title: "Title",
    content: `### Title

**Instructional Focus:**
> What happens when the bowl is too small? Like a goldfish, an AI has limited short-term memory. When a conversation exceeds that window, early information simply falls out of reach.

**Learning Objectives:**
- Internalize the 'Goldfish Problem': Models are stateless and lack persistent memory.
- Manage AI context by explicitly providing all necessary information per interaction.
- Recognize the limitations of zero-shot prompting without context injection.
`
  },
  {
    moduleId: "2",
    lessonIndex: 0,
    slideIndex: 1,
    id: "m2-forgot-name",
    title: "Forgot Name",
    content: `### Forgot Name

**Instructional Focus:**
> Have you ever given an AI a long document, set a strict rule at the top, and found it completely ignoring that rule by the end? Let's look at the Goldfish Problem in action. In this chat, we told the AI to always call us 'Captain'. Watch what happens when we feed it a massive 3,500 token report.

**Learning Objectives:**
- Internalize the 'Goldfish Problem': Models are stateless and lack persistent memory.
- Manage AI context by explicitly providing all necessary information per interaction.
- Recognize the limitations of zero-shot prompting without context injection.
`
  },
  {
    moduleId: "2",
    lessonIndex: 0,
    slideIndex: 2,
    id: "m2-forgot-name-mechanics",
    title: "Forgot Name Mechanics",
    content: `### Forgot Name Mechanics

**Instructional Focus:**
> To understand why this happens, you have to look at how an AI processes conversation history. It doesn't read the chat like a book; it treats it like a conveyor belt with a strict length limit. This is called a First-In-First-Out, or FIFO, queue. When you paste in a massive document, the newest toke...

**Learning Objectives:**
- Internalize the 'Goldfish Problem': Models are stateless and lack persistent memory.
- Manage AI context by explicitly providing all necessary information per interaction.
- Recognize the limitations of zero-shot prompting without context injection.
`
  },
  {
    moduleId: "2",
    lessonIndex: 0,
    slideIndex: 3,
    id: "m2-real-world-consequences",
    title: "Real World Consequences",
    content: `### Real World Consequences

**Instructional Focus:**
> This isn't just an annoyance; it's a critical failure point in production. If you're coding, the AI might revert to older framework versions. In data analysis, it might forget your specific exclusion rules. And in content creation, your carefully crafted brand voice is replaced by generic AI speak. ...

**Learning Objectives:**
- Internalize the 'Goldfish Problem': Models are stateless and lack persistent memory.
- Manage AI context by explicitly providing all necessary information per interaction.
- Recognize the limitations of zero-shot prompting without context injection.
`
  },
  {
    moduleId: "2",
    lessonIndex: 1,
    slideIndex: 4,
    id: "m2-tokens-intro",
    title: "Tokens Intro",
    content: `### Tokens Intro

**Instructional Focus:**
> Before we solve the problem, we need to understand how AI measures information. Let's talk about Tokens—the true currency of AI. An AI doesn't read words like we do. It breaks text into smaller chunks called tokens. A simple word might be one token, but a complex word like 'Hamburger' gets chopped i...

**Learning Objectives:**
- Define 'tokens' as the fundamental currency of AI processing.
- Analyze how token economics impact both cost and latency.
- Optimize context windows to maximize efficiency and minimize token waste.
`
  },
  {
    moduleId: "2",
    lessonIndex: 1,
    slideIndex: 5,
    id: "m2-token-economics",
    title: "Token Economics",
    content: `### Token Economics

**Instructional Focus:**
> Why does this distinction matter? Because every token has a cost. You are billed per token, both for input and output. Furthermore, tokens are heavily biased towards English. A single sentence in English might be five tokens, but translating that exact sentence to Hindi or Japanese could cost twenty...

**Learning Objectives:**
- Define 'tokens' as the fundamental currency of AI processing.
- Analyze how token economics impact both cost and latency.
- Optimize context windows to maximize efficiency and minimize token waste.
`
  },
  {
    moduleId: "2",
    lessonIndex: 1,
    slideIndex: 6,
    id: "m2-tokenizer",
    title: "Tokenizer",
    content: `### Tokenizer

**Instructional Focus:**
> Try typing a sentence below. You'll see that a token isn't always a full word. Sometimes it's a syllable, or even just a space. This is how the AI sees your text.

**Learning Objectives:**
- Define 'tokens' as the fundamental currency of AI processing.
- Analyze how token economics impact both cost and latency.
- Optimize context windows to maximize efficiency and minimize token waste.
`
  },
  {
    moduleId: "2",
    lessonIndex: 1,
    slideIndex: 7,
    id: "module-2-quiz-1",
    title: "Module 2 Quiz 1",
    content: `### Module 2 Quiz 1

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Define 'tokens' as the fundamental currency of AI processing.
- Analyze how token economics impact both cost and latency.
- Optimize context windows to maximize efficiency and minimize token waste.
`
  },
  {
    moduleId: "2",
    lessonIndex: 2,
    slideIndex: 8,
    id: "m2-context-windows",
    title: "Context Windows",
    content: `### Context Windows

**Instructional Focus:**
> A context window is the absolute limit of tokens an AI can process at one time. In 2023, eight thousand tokens was considered large. By 2026, models can process over a million tokens in a single prompt.

**Learning Objectives:**
- Map the capabilities and limits of modern context windows.
- Mitigate the 'Lost in the Middle' phenomenon by structuring context effectively.
- Prioritize critical information placement within the context window.
`
  },
  {
    moduleId: "2",
    lessonIndex: 2,
    slideIndex: 9,
    id: "m2-lost-in-middle",
    title: "Lost In Middle",
    content: `### Lost In Middle

**Instructional Focus:**
> But bigger isn't always better. Research consistently shows a U-shaped performance curve. Models pay close attention to the beginning and end of a prompt, but often ignore what's buried in the middle.

**Learning Objectives:**
- Map the capabilities and limits of modern context windows.
- Mitigate the 'Lost in the Middle' phenomenon by structuring context effectively.
- Prioritize critical information placement within the context window.
`
  },
  {
    moduleId: "2",
    lessonIndex: 2,
    slideIndex: 10,
    id: "m2-attention-heatmap",
    title: "Attention Heatmap",
    content: `### Attention Heatmap

**Instructional Focus:**
> Drag the slider to scan through the document's context buffer. Notice how the AI's attention score is perfect at the top and bottom, but plummets in the middle, causing critical details to be completely ignored.

**Learning Objectives:**
- Map the capabilities and limits of modern context windows.
- Mitigate the 'Lost in the Middle' phenomenon by structuring context effectively.
- Prioritize critical information placement within the context window.
`
  },
  {
    moduleId: "2",
    lessonIndex: 3,
    slideIndex: 11,
    id: "m2-rag-video",
    title: "Rag Video",
    content: `### Rag Video

**Instructional Focus:**
> So, if stuffing a massive context window doesn't work, what does? The answer is Retrieval-Augmented Generation, or RAG. It's like giving the AI an open-book test.

**Learning Objectives:**
- Deconstruct the Retrieval-Augmented Generation (RAG) architecture.
- Explain how vector embeddings map semantic meaning to spatial coordinates.
- Understand how RAG provides 'long-term memory' to stateless models.
`
  },
  {
    moduleId: "2",
    lessonIndex: 3,
    slideIndex: 12,
    id: "m2-rag-pipeline",
    title: "Rag Pipeline",
    content: `### Rag Pipeline

**Instructional Focus:**
> Click through the steps to see RAG in action. First, a retriever searches a database. Then, it pulls only the most relevant facts. Finally, it injects those specific facts into the context window right before generating the answer.

**Learning Objectives:**
- Deconstruct the Retrieval-Augmented Generation (RAG) architecture.
- Explain how vector embeddings map semantic meaning to spatial coordinates.
- Understand how RAG provides 'long-term memory' to stateless models.
`
  },
  {
    moduleId: "2",
    lessonIndex: 3,
    slideIndex: 13,
    id: "m2-rag-compare",
    title: "Rag Compare",
    content: `### Rag Compare

**Instructional Focus:**
> RAG is cheaper, faster, and far more accurate than just pasting a massive document into the prompt. It grounds the AI in reality.

**Learning Objectives:**
- Deconstruct the Retrieval-Augmented Generation (RAG) architecture.
- Explain how vector embeddings map semantic meaning to spatial coordinates.
- Understand how RAG provides 'long-term memory' to stateless models.
`
  },
  {
    moduleId: "2",
    lessonIndex: 3,
    slideIndex: 14,
    id: "m2-rag-foundation",
    title: "Rag Foundation",
    content: `### Rag Foundation

**Instructional Focus:**
> But RAG isn't just a trick for chatting with PDFs. It is the architectural foundation of modern AI. Every time an MCP fetches live data, or an agent loads a specific skill, they are using RAG principles to dynamically manage their context window. This is the essence of Context Engineering.

**Learning Objectives:**
- Deconstruct the Retrieval-Augmented Generation (RAG) architecture.
- Explain how vector embeddings map semantic meaning to spatial coordinates.
- Understand how RAG provides 'long-term memory' to stateless models.
`
  },
  {
    moduleId: "2",
    lessonIndex: 3,
    slideIndex: 15,
    id: "module-2-quiz-2",
    title: "Module 2 Quiz 2",
    content: `### Module 2 Quiz 2

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Deconstruct the Retrieval-Augmented Generation (RAG) architecture.
- Explain how vector embeddings map semantic meaning to spatial coordinates.
- Understand how RAG provides 'long-term memory' to stateless models.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 16,
    id: "m2-context-engineering",
    title: "Context Engineering",
    content: `### Context Engineering

**Instructional Focus:**
> Context Engineering is the art of managing AI working memory. The three golden rules: keep the context clean by filtering noise, put the most important instructions at the very end to exploit the U-curve, and use external memory to offload large datasets.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 17,
    id: "m2-mcp-teaser",
    title: "Mcp Teaser",
    content: `### Mcp Teaser

**Instructional Focus:**
> To implement this External Memory, the industry standard is MCP: the Model Context Protocol. MCPs are standardized servers that securely connect your AI to databases, APIs, and file systems. You can find pre-built MCPs at smithery.ai or mcp.so, or even build your own.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 18,
    id: "m2-skills-teaser",
    title: "Skills Teaser",
    content: `### Skills Teaser

**Instructional Focus:**
> To implement Clean Context, you use Markdown Skills. Instead of giving an agent one massive, confusing prompt, you create modular dot-MD files that define highly specific behaviors. You can find community skills on GitHub, or simply instruct your agent to research and write new skills for itself.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 19,
    id: "m2-web-vs-local",
    title: "Web Vs Local",
    content: `### Web Vs Local

**Instructional Focus:**
> Web versions of LLMs are often highly sandboxed and limited in the tools they can use. Going forward into the Toolbelt section, you'll need to set up tools and understand how API calls work. We recommend using CLI tools to install and run agents. Or, for a GUI experience, download a Desktop LLM appl...

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 20,
    id: "m2-finding-tools",
    title: "Finding Tools",
    content: `### Finding Tools

**Instructional Focus:**
> If you're wondering how to find the best stack for your project, don't worry. The ecosystem is moving fast, but the strategy is simple. For this project tie in, you just need two things. First, select a foundation model known for strong function-calling capabilities. Then, choose a CLI harness or de...

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 21,
    id: "m2-project-llm",
    title: "Project Llm",
    content: `### Project Llm

**Instructional Focus:**
> It's time to choose your engine. When researching LLMs, look for providers offering free tiers with API access—this is different from a free chat interface! Some models require a subscription to use their API. For learning, we highly recommend Gemini, as it offers a generous free API tier perfect fo...

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 22,
    id: "m2-project-harness",
    title: "Project Harness",
    content: `### Project Harness

**Instructional Focus:**
> Next, choose your harness. This is the application that will run your agent and give it access to your local environment. While there are many desktop and CLI options available, we highly recommend using the Antigravity CLI or Desktop tool to follow along with this course.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 23,
    id: "m2-project-context",
    title: "Project Context",
    content: `### Project Context

**Instructional Focus:**
> Now it's time to set up your project environment. You will create a new folder, a docs folder, and generate a comprehensive AI Context document using an LLM. This document will ensure your agent writes code that exactly matches your architectural rules.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 24,
    id: "m2-doc-product",
    title: "Doc Product",
    content: `### Doc Product

**Instructional Focus:**
> Paste the generated docs/PRODUCT.md content into the editor to save it to your project.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 25,
    id: "m2-doc-domain",
    title: "Doc Domain",
    content: `### Doc Domain

**Instructional Focus:**
> Paste the generated docs/DOMAIN.md content into the editor to save it to your project.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 26,
    id: "m2-doc-architecture",
    title: "Doc Architecture",
    content: `### Doc Architecture

**Instructional Focus:**
> Paste the generated docs/ARCHITECTURE.md content into the editor to save it to your project.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 27,
    id: "m2-doc-design",
    title: "Doc Design",
    content: `### Doc Design

**Instructional Focus:**
> Paste the generated docs/DESIGN.md content into the editor to save it to your project.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 28,
    id: "m2-doc-constraints",
    title: "Doc Constraints",
    content: `### Doc Constraints

**Instructional Focus:**
> Paste the generated docs/CONSTRAINTS.md content into the editor to save it to your project.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 29,
    id: "m2-doc-decisions",
    title: "Doc Decisions",
    content: `### Doc Decisions

**Instructional Focus:**
> Paste the generated docs/DECISIONS.md content into the editor to save it to your project.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 30,
    id: "m2-project-checkpoint",
    title: "Project Checkpoint",
    content: `### Project Checkpoint

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "2",
    lessonIndex: 4,
    slideIndex: 31,
    id: "module-2-quiz",
    title: "Module 2 Quiz",
    content: `### Module 2 Quiz

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Design an effective Context Engineering pipeline.
- Synthesize and compress context between workflow stages to maintain fidelity.
- Structure input data to maximize retrieval relevance and model comprehension.
`
  },
  {
    moduleId: "3",
    lessonIndex: 0,
    slideIndex: 0,
    id: "m3-title",
    title: "Title",
    content: `### Title

**Instructional Focus:**
> A raw AI is like a brain trapped in a jar. It can think and talk, but it can't touch the outside world. To take action—to search the web, read files, or control software—it needs a Toolbelt.

**Learning Objectives:**
- Transition from conversational AI (chat) to active AI (tools).
- Understand the fundamental difference between generating text and executing actions.
- Identify the boundaries of a language model in isolation.
`
  },
  {
    moduleId: "3",
    lessonIndex: 0,
    slideIndex: 1,
    id: "m3-text-vs-action",
    title: "Text Vs Action",
    content: `### Text Vs Action

**Instructional Focus:**
> Without tools, an LLM can only generate text based on its past training. With tools, it becomes an active participant in your workflow, capable of fetching live data or executing code.

**Learning Objectives:**
- Transition from conversational AI (chat) to active AI (tools).
- Understand the fundamental difference between generating text and executing actions.
- Identify the boundaries of a language model in isolation.
`
  },
  {
    moduleId: "3",
    lessonIndex: 1,
    slideIndex: 2,
    id: "m3-function-calling",
    title: "Function Calling",
    content: `### Function Calling

**Instructional Focus:**
> The AI itself doesn't browse the internet or run code. It strictly analyzes your prompt and generates a structured request—usually in JSON. This architectural separation is critical for system safety and control.

**Learning Objectives:**
- Deconstruct the Function Calling loop: generate JSON -> execute -> return result.
- Design explicit tool schemas that the LLM can interpret and execute.
- Handle tool execution errors and parse model responses.
`
  },
  {
    moduleId: "3",
    lessonIndex: 1,
    slideIndex: 3,
    id: "m3-function-calling-loop",
    title: "Function Calling Loop",
    content: `### Function Calling Loop

**Instructional Focus:**
> Here is the full execution loop. The LLM signals intent, a separate execution harness runs the actual function, and the result is fed back into the LLM to generate your final answer.

**Learning Objectives:**
- Deconstruct the Function Calling loop: generate JSON -> execute -> return result.
- Design explicit tool schemas that the LLM can interpret and execute.
- Handle tool execution errors and parse model responses.
`
  },
  {
    moduleId: "3",
    lessonIndex: 1,
    slideIndex: 4,
    id: "m3-tool-filesystem",
    title: "Tool Filesystem",
    content: `### Tool Filesystem

**Instructional Focus:**
> Beyond simple web APIs, one of the most powerful tool categories is filesystem access. By exposing tools like read file and write file, an LLM can analyze your local codebase, review logs, and even rewrite entire documents.

**Learning Objectives:**
- Deconstruct the Function Calling loop: generate JSON -> execute -> return result.
- Design explicit tool schemas that the LLM can interpret and execute.
- Handle tool execution errors and parse model responses.
`
  },
  {
    moduleId: "3",
    lessonIndex: 1,
    slideIndex: 5,
    id: "m3-filesystem-rag",
    title: "Filesystem Rag",
    content: `### Filesystem Rag

**Instructional Focus:**
> Filesystems are essentially local RAG. Saving markdown documents in a folder and initiating the agent there provides the most effective dynamic context management. This is the foundation of skills dot m d systems. We will learn more about this soon. These documents simply teach the AI a certain skil...

**Learning Objectives:**
- Deconstruct the Function Calling loop: generate JSON -> execute -> return result.
- Design explicit tool schemas that the LLM can interpret and execute.
- Handle tool execution errors and parse model responses.
`
  },
  {
    moduleId: "3",
    lessonIndex: 1,
    slideIndex: 6,
    id: "m3-tool-code-execution",
    title: "Tool Code Execution",
    content: `### Tool Code Execution

**Instructional Focus:**
> Another critical category is computational action. LLMs famously struggle with precise math and logic. By using a code interpreter tool, the AI can write a Python script, execute it in a secure sandbox, and return a flawless mathematical result.

**Learning Objectives:**
- Deconstruct the Function Calling loop: generate JSON -> execute -> return result.
- Design explicit tool schemas that the LLM can interpret and execute.
- Handle tool execution errors and parse model responses.
`
  },
  {
    moduleId: "3",
    lessonIndex: 1,
    slideIndex: 7,
    id: "module-3-quiz-1",
    title: "Module 3 Quiz 1",
    content: `### Module 3 Quiz 1

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Deconstruct the Function Calling loop: generate JSON -> execute -> return result.
- Design explicit tool schemas that the LLM can interpret and execute.
- Handle tool execution errors and parse model responses.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 8,
    id: "m3-plugin-chaos",
    title: "Plugin Chaos",
    content: `### Plugin Chaos

**Instructional Focus:**
> In the early days, every AI company built their own proprietary way to connect to tools. If you had 5 models and 5 tools, you needed 25 custom, fragile integrations. We call this the N by M integration problem.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 9,
    id: "m3-plugin-chaos-cost",
    title: "Plugin Chaos Cost",
    content: `### Plugin Chaos Cost

**Instructional Focus:**
> This plugin chaos meant development teams spent most of their time fixing broken plumbing rather than building features. It was a maintenance nightmare, like trying to travel internationally with dozens of different power adapters.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 10,
    id: "m3-mcp-translator",
    title: "Mcp Translator",
    content: `### Mcp Translator

**Instructional Focus:**
> In late 2024, the industry aligned on an open standard: The Model Context Protocol, or MCP. Think of it as the USB-C port for AI. It allows any model to securely connect to any external data source using one standardized plug.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 11,
    id: "m3-mcp-architecture",
    title: "Mcp Architecture",
    content: `### Mcp Architecture

**Instructional Focus:**
> Instead of a chaotic web, MCP uses a clean client-server architecture. An AI application runs an MCP Client, which speaks the standard protocol to any MCP Server. This transforms the N by M nightmare into a simple N plus M equation.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 12,
    id: "m3-mcp-components",
    title: "Mcp Components",
    content: `### Mcp Components

**Instructional Focus:**
> An MCP Server exposes three main capabilities to the LLM: Resources, which provide context like file contents; Prompts, which are reusable templates; and Tools, which are executable functions. This standardizes the entire AI workflow.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 13,
    id: "m3-tool-registry",
    title: "Tool Registry",
    content: `### Tool Registry

**Instructional Focus:**
> Because MCP is an open standard, a massive community registry of servers has emerged. You don't have to build integrations from scratch. Instead, you can simply pull pre-built servers directly into your AI workflow.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 14,
    id: "m3-mcp-ecosystem",
    title: "Mcp Ecosystem",
    content: `### Mcp Ecosystem

**Instructional Focus:**
> This means your AI can instantly search the web, pull code from GitHub, query a local PostgreSQL database, or send messages in Slack—all using the exact same standard protocol.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 15,
    id: "m3-important-mcps",
    title: "Important Mcps",
    content: `### Important Mcps

**Instructional Focus:**
> To navigate the rapidly expanding MCP ecosystem, several powerful directories have emerged. Platforms like Smithery.ai, MCP.so, and Glama.ai offer thousands of integrations. For developers, the Official Registry and the Awesome MCP list on GitHub provide high-quality reference implementations.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 2,
    slideIndex: 16,
    id: "module-3-quiz-2",
    title: "Module 3 Quiz 2",
    content: `### Module 3 Quiz 2

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Explore the Model Context Protocol (MCP) as a universal translator.
- Analyze MCP's architecture (Host, Client, Server).
- Identify how MCP standardizes the tool integration process.
`
  },
  {
    moduleId: "3",
    lessonIndex: 3,
    slideIndex: 17,
    id: "m3-agents-md",
    title: "Agents Md",
    content: `### Agents Md

**Instructional Focus:**
> Beyond external APIs, modern AI agents rely on Markdown-based documentation like AGENTS.md placed directly in your repository. Think of this as the system prompt translated into code. It gives the agent your project's coding standards, boundaries, and architectural context every time it opens your f...

**Learning Objectives:**
- Navigate the MCP ecosystem and evaluate available pre-built tools.
- Distinguish between essential MCPs (filesystem, search) and specialized tools.
- Select the appropriate MCPs to fulfill your Project Spine's requirements.
`
  },
  {
    moduleId: "3",
    lessonIndex: 3,
    slideIndex: 18,
    id: "m3-agents-md-exercise",
    title: "Agents Md Exercise",
    content: `### Agents Md Exercise

**Instructional Focus:**
> Now it's your turn. Let's build the blueprint for your own AI agents. Click 'Copy Prompt' to grab the instructions, paste them into your favorite AI tool like Gemini or Claude, and fill in your project context. The LLM will generate your custom AGENTS.md file. When it's done, paste the markdown righ...

**Learning Objectives:**
- Navigate the MCP ecosystem and evaluate available pre-built tools.
- Distinguish between essential MCPs (filesystem, search) and specialized tools.
- Select the appropriate MCPs to fulfill your Project Spine's requirements.
`
  },
  {
    moduleId: "3",
    lessonIndex: 3,
    slideIndex: 19,
    id: "m3-skills-ecosystem",
    title: "Skills Ecosystem",
    content: `### Skills Ecosystem

**Instructional Focus:**
> But you can't fit everything into one file. That's where the SKILLS ecosystem comes in. By creating targeted documents like a Frontend Design Skill or a System Architecture Skill, you give the AI specific, modular instructions. For example, a frontend skill can force the AI to use specific Tailwind ...

**Learning Objectives:**
- Navigate the MCP ecosystem and evaluate available pre-built tools.
- Distinguish between essential MCPs (filesystem, search) and specialized tools.
- Select the appropriate MCPs to fulfill your Project Spine's requirements.
`
  },
  {
    moduleId: "3",
    lessonIndex: 3,
    slideIndex: 20,
    id: "m3-skills-deep-dive",
    title: "Skills Deep Dive",
    content: `### Skills Deep Dive

**Instructional Focus:**
> This ecosystem opens up massive possibilities. You can categorize skills by Workflow, Context, or Expert persona. You can search community repositories and install skills instantly. The ultimate leverage? Digitize your own subject matter expertise. Write a skill that codifies your exact mental model...

**Learning Objectives:**
- Navigate the MCP ecosystem and evaluate available pre-built tools.
- Distinguish between essential MCPs (filesystem, search) and specialized tools.
- Select the appropriate MCPs to fulfill your Project Spine's requirements.
`
  },
  {
    moduleId: "3",
    lessonIndex: 3,
    slideIndex: 21,
    id: "m3-skills-directories",
    title: "Skills Directories",
    content: `### Skills Directories

**Instructional Focus:**
> So where do you find these skills? Directories like skills.sh and cursor.directory are community-curated goldmines. But the true power move is installing a Meta-Skill—a skill designed solely to analyze your workflow and generate new skills on the fly. Head over to your CLI now and try asking your ag...

**Learning Objectives:**
- Navigate the MCP ecosystem and evaluate available pre-built tools.
- Distinguish between essential MCPs (filesystem, search) and specialized tools.
- Select the appropriate MCPs to fulfill your Project Spine's requirements.
`
  },
  {
    moduleId: "3",
    lessonIndex: 3,
    slideIndex: 22,
    id: "m3-enhancing-harness",
    title: "Enhancing Harness",
    content: `### Enhancing Harness

**Instructional Focus:**
> You can radically enhance your harness by installing these skills directly into your workspace. By keeping a world-class AGENTS.md and modular skill documents in your project folder, any capable harness—like Antigravity or Claude Desktop—will dynamically ingest this context. This is how you transfor...

**Learning Objectives:**
- Navigate the MCP ecosystem and evaluate available pre-built tools.
- Distinguish between essential MCPs (filesystem, search) and specialized tools.
- Select the appropriate MCPs to fulfill your Project Spine's requirements.
`
  },
  {
    moduleId: "3",
    lessonIndex: 3,
    slideIndex: 23,
    id: "m3-enriching-prompts",
    title: "Enriching Prompts",
    content: `### Enriching Prompts

**Instructional Focus:**
> Finally, to actually trigger these capabilities, you must enrich your prompts. Instead of simply asking the AI to 'build a component', explicitly instruct it to 'use the frontend design skill to build a component'. This forces the agent to read the documentation first via local RAG, ensuring its out...

**Learning Objectives:**
- Navigate the MCP ecosystem and evaluate available pre-built tools.
- Distinguish between essential MCPs (filesystem, search) and specialized tools.
- Select the appropriate MCPs to fulfill your Project Spine's requirements.
`
  },
  {
    moduleId: "3",
    lessonIndex: 3,
    slideIndex: 24,
    id: "module-3-quiz-3",
    title: "Module 3 Quiz 3",
    content: `### Module 3 Quiz 3

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Navigate the MCP ecosystem and evaluate available pre-built tools.
- Distinguish between essential MCPs (filesystem, search) and specialized tools.
- Select the appropriate MCPs to fulfill your Project Spine's requirements.
`
  },
  {
    moduleId: "3",
    lessonIndex: 4,
    slideIndex: 25,
    id: "m3-project-toolbelt-research",
    title: "Project Toolbelt Research",
    content: `### Project Toolbelt Research

**Instructional Focus:**
> It is time to architect the toolbelt for your specific capstone project. An agent is only as good as the tools it can reach. I want you to open Gemini or ChatGPT in another tab, and paste in this exact prompt. We're going to ask the AI to design the required MCP servers, CLI tools, and skills needed...

**Learning Objectives:**
- Analyze the 'Skills Ecosystem' as higher-level capabilities for AI models.
- Integrate specialized skills (e.g., frontend design, specific writing tones).
- Combine tools and skills to create a comprehensive AI toolbelt.
`
  },
  {
    moduleId: "3",
    lessonIndex: 4,
    slideIndex: 26,
    id: "m3-project-toolbelt-blueprint",
    title: "Project Toolbelt Blueprint",
    content: `### Project Toolbelt Blueprint

**Instructional Focus:**
> Now that you have your research, it is time to build your blueprint. Document the top MCP servers, CLI tools, and SKILL rulesets you identified. This blueprint will serve as your technical roadmap when we begin assembling your agent's loops in the next module.

**Learning Objectives:**
- Analyze the 'Skills Ecosystem' as higher-level capabilities for AI models.
- Integrate specialized skills (e.g., frontend design, specific writing tones).
- Combine tools and skills to create a comprehensive AI toolbelt.
`
  },
  {
    moduleId: "3",
    lessonIndex: 4,
    slideIndex: 27,
    id: "m3-toolbelt-setup-checkpoint",
    title: "Toolbelt Setup Checkpoint",
    content: `### Toolbelt Setup Checkpoint

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Analyze the 'Skills Ecosystem' as higher-level capabilities for AI models.
- Integrate specialized skills (e.g., frontend design, specific writing tones).
- Combine tools and skills to create a comprehensive AI toolbelt.
`
  },
  {
    moduleId: "3",
    lessonIndex: 4,
    slideIndex: 28,
    id: "m3-assessment-intro",
    title: "Assessment Intro",
    content: `### Assessment Intro

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Analyze the 'Skills Ecosystem' as higher-level capabilities for AI models.
- Integrate specialized skills (e.g., frontend design, specific writing tones).
- Combine tools and skills to create a comprehensive AI toolbelt.
`
  },
  {
    moduleId: "3",
    lessonIndex: 4,
    slideIndex: 29,
    id: "module-3-quiz",
    title: "Module 3 Quiz",
    content: `### Module 3 Quiz

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Analyze the 'Skills Ecosystem' as higher-level capabilities for AI models.
- Integrate specialized skills (e.g., frontend design, specific writing tones).
- Combine tools and skills to create a comprehensive AI toolbelt.
`
  },
  {
    moduleId: "4",
    lessonIndex: 0,
    slideIndex: 0,
    id: "m4-1b-evolution-steps",
    title: "1b Evolution Steps",
    content: `### 1b Evolution Steps

**Instructional Focus:**
> This is the evolution of AI engineering. We started with Prompt Engineering in Module 1, moved to Context Engineering in Module 2, built our Harness in Module 3, and now, we scale up to designing autonomous, self-correcting agent systems in Module 4.

**Learning Objectives:**
- Deconstruct the Agent loop: Observe, Think, Act, Observe.
- Contrast naïve execution with autonomous, iterative agentic workflows.
- Understand how looping enables self-correction and multi-step reasoning.
`
  },
  {
    moduleId: "4",
    lessonIndex: 0,
    slideIndex: 1,
    id: "m4-2-loop-anatomy",
    title: "2 Loop Anatomy",
    content: `### 2 Loop Anatomy

**Instructional Focus:**
> An autonomous loop isn't magic; it's a structured control system. After each prompt you give, the agent runs this entire loop until the task is complete. It starts with a Goal, Reasons about the next step, Acts using tools, Observes the result, and crucially, Verifies if it's done. Without verificat...

**Learning Objectives:**
- Deconstruct the Agent loop: Observe, Think, Act, Observe.
- Contrast naïve execution with autonomous, iterative agentic workflows.
- Understand how looping enables self-correction and multi-step reasoning.
`
  },
  {
    moduleId: "4",
    lessonIndex: 1,
    slideIndex: 2,
    id: "m4-3a-naive-execution",
    title: "3a Naive Execution",
    content: `### 3a Naive Execution

**Instructional Focus:**
> Before ReAct, we used naive zero-shot execution. We gave the agent a goal, and it immediately fired a tool. But without a space to plan, it hallucinated arguments, misunderstood context, and ultimately crashed.

**Learning Objectives:**
- Implement the ReAct (Reason + Act) pattern for robust agent behavior.
- Force the model to articulate its reasoning before committing to an action.
- Trace how explicit reasoning reduces hallucinations and errors.
`
  },
  {
    moduleId: "4",
    lessonIndex: 1,
    slideIndex: 3,
    id: "m4-3b-react-pattern",
    title: "3b React Pattern",
    content: `### 3b React Pattern

**Instructional Focus:**
> Enter ReAct: Reason, then Act. ReAct forces the model into an internal monologue. By thinking out loud in a scratchpad, the agent catches its own logical flaws before it ever touches your systems.

**Learning Objectives:**
- Implement the ReAct (Reason + Act) pattern for robust agent behavior.
- Force the model to articulate its reasoning before committing to an action.
- Trace how explicit reasoning reduces hallucinations and errors.
`
  },
  {
    moduleId: "4",
    lessonIndex: 2,
    slideIndex: 4,
    id: "m4-4-capstone-sim",
    title: "4 Capstone Sim",
    content: `### 4 Capstone Sim

**Instructional Focus:**
> Let's see this in action for your specific Capstone. Watch the terminal. You'll see the agent reason about the problem, use the tools you wired in the last module, observe the results, and self-correct when it hits a roadblock. Once you're done watching this simulation, go to your actual Harness, pu...

**Learning Objectives:**
- Analyze the pitfalls of naïve AI execution without autonomous loops.
- Compare the reliability of linear prompting versus agentic workflows.
- Transition from simple prompting to designing complex agentic systems.
`
  },
  {
    moduleId: "4",
    lessonIndex: 3,
    slideIndex: 5,
    id: "m4-5-verification",
    title: "5 Verification",
    content: `### 5 Verification

**Instructional Focus:**
> The most dangerous thing you can do is give an agent a vague goal. 'Make this better' is a recipe for an infinite loop and a massive API bill. A loop must have a rigid, mathematically verifiable 'Done' condition.

**Learning Objectives:**
- Design rigorous 'Done' conditions to prevent infinite loops.
- Implement verification checks at crucial workflow checkpoints.
- Ensure agents know exactly when a task is successfully completed.
`
  },
  {
    moduleId: "4",
    lessonIndex: 4,
    slideIndex: 6,
    id: "m4-6-hitl",
    title: "6 Hitl",
    content: `### 6 Hitl

**Instructional Focus:**
> True autonomy is earned, not given. For destructive actions, subjective decisions, or high-stakes outputs, we engineer a Human-in-the-Loop gate. The loop pauses, alerts you, and waits for your cryptographic approval before proceeding.

**Learning Objectives:**
- Define the Human-in-the-Loop (HITL) safety mechanism.
- Implement explicit approval gates for high-stakes agent actions.
- Balance agent autonomy with necessary human oversight and control.
`
  },
  {
    moduleId: "6",
    lessonIndex: 0,
    slideIndex: 0,
    id: "m6-1-intro",
    title: "1 Intro",
    content: `### 1 Intro

**Instructional Focus:**
> You've built your AI app. But a prompt that works once on your laptop isn't production-ready. Welcome to the real world of LLMOps, where applications must survive scale, edge cases, and continuous drift.

**Learning Objectives:**
- Map the AI system lifecycle from prototype to production.
- Identify the unique challenges of operationalizing non-deterministic systems.
- Establish a framework for continuous iteration and improvement.
`
  },
  {
    moduleId: "6",
    lessonIndex: 0,
    slideIndex: 1,
    id: "m6-2-lifecycle",
    title: "2 Lifecycle",
    content: `### 2 Lifecycle

**Instructional Focus:**
> The LLMOps lifecycle replaces prototype thinking with engineering rigor. It introduces version control for prompts, golden datasets for regression testing, and CI/CD pipelines tailored specifically for AI.

**Learning Objectives:**
- Map the AI system lifecycle from prototype to production.
- Identify the unique challenges of operationalizing non-deterministic systems.
- Establish a framework for continuous iteration and improvement.
`
  },
  {
    moduleId: "6",
    lessonIndex: 0,
    slideIndex: 2,
    id: "m6-3-judge",
    title: "3 Judge",
    content: `### 3 Judge

**Instructional Focus:**
> How do you know if an LLM's output is actually good? Traditional code tests fail here. Instead, we use LLM-as-a-Judge: employing a superior model like GPT-4 to grade your application's output against a strict semantic rubric.

**Learning Objectives:**
- Map the AI system lifecycle from prototype to production.
- Identify the unique challenges of operationalizing non-deterministic systems.
- Establish a framework for continuous iteration and improvement.
`
  },
  {
    moduleId: "6",
    lessonIndex: 0,
    slideIndex: 3,
    id: "m6-4-drift",
    title: "4 Drift",
    content: `### 4 Drift

**Instructional Focus:**
> AI is not static. Prompt drift occurs when users change their behavior, or when model providers quietly update their endpoints. Without constant observability and regression testing, your app will silently degrade.

**Learning Objectives:**
- Map the AI system lifecycle from prototype to production.
- Identify the unique challenges of operationalizing non-deterministic systems.
- Establish a framework for continuous iteration and improvement.
`
  },
  {
    moduleId: "6",
    lessonIndex: 1,
    slideIndex: 4,
    id: "m6-5-pace",
    title: "5 Pace",
    content: `### 5 Pace

**Instructional Focus:**
> The landscape is evolving at a breakneck pace. New models, frameworks, and techniques drop weekly. You cannot learn everything. You must build a system to filter the noise and focus on durable paradigms.

**Learning Objectives:**
- Implement evaluation frameworks ('Evals') to measure AI output quality.
- Track and mitigate model drift over time.
- Design robust tests to ensure system reliability across updates.
`
  },
  {
    moduleId: "6",
    lessonIndex: 1,
    slideIndex: 5,
    id: "m6-6-signal",
    title: "6 Signal",
    content: `### 6 Signal

**Instructional Focus:**
> We maintain the Tool Landscape as a living document. Check it quarterly. Don't chase every trend. Focus on tools that solve your immediate bottlenecks, whether that's tracing, evaluation, or context retrieval.

**Learning Objectives:**
- Implement evaluation frameworks ('Evals') to measure AI output quality.
- Track and mitigate model drift over time.
- Design robust tests to ensure system reliability across updates.
`
  },
  {
    moduleId: "6",
    lessonIndex: 2,
    slideIndex: 6,
    id: "m6-7-assessment",
    title: "7 Assessment",
    content: `### 7 Assessment

**Instructional Focus:**
> This slide acts as a structural milestone and knowledge check to solidify your understanding before proceeding. Take time to evaluate your comprehension of the preceding concepts.

**Learning Objectives:**
- Transition your Project Spine from a local prototype to a production-ready system.
- Address scalability, security, and error-handling requirements.
- Finalize the architecture for your AI application.
`
  },
  {
    moduleId: "6",
    lessonIndex: 3,
    slideIndex: 7,
    id: "m6-8-journey",
    title: "8 Journey",
    content: `### 8 Journey

**Instructional Focus:**
> Look how far you've come. From understanding tokens and context windows, to wiring tools and MCPs, to orchestrating autonomous agents, and finally deploying robust LLMOps. You are now an AI Engineer.

**Learning Objectives:**
- Review the entire Concept to Application journey.
- Consolidate the foundational principles of generative AI integration.
- Prepare for the final capstone assessment and certification.
`
  },
  {
    moduleId: "6",
    lessonIndex: 3,
    slideIndex: 8,
    id: "m6-9-graduation",
    title: "9 Graduation",
    content: `### 9 Graduation

**Instructional Focus:**
> Congratulations. Your capstone is complete, your foundations are solid, and your horizon is clear. Share your work with the community, keep building, and never stop experimenting. Class dismissed.

**Learning Objectives:**
- Review the entire Concept to Application journey.
- Consolidate the foundational principles of generative AI integration.
- Prepare for the final capstone assessment and certification.
`
  }
];

export function getCourseNote(moduleId: string, lessonIndex: number, slideIndex: number): string {
  const exact = COURSE_NOTES.find(
    n => n.moduleId === moduleId && n.lessonIndex === lessonIndex && n.slideIndex === slideIndex
  );
  if (exact) return exact.content;

  const lesson = COURSE_NOTES.find(
    n => n.moduleId === moduleId && n.lessonIndex === lessonIndex
  );
  if (lesson) return lesson.content;

  const mod = COURSE_NOTES.find(n => n.moduleId === moduleId);
  if (mod) return mod.content;

  return "## Module Notes\n\nFocus on the core concepts presented in this section.";
}
