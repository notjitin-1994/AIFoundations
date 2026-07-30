import json
import re

new_questions = [
  {
    "id": "ext1-mcq-q1-009",
    "moduleId": "2",
    "type": "multiple-choice",
    "difficulty": "easy",
    "tags": ["context-engineering"],
    "prompt": "What are the three golden rules of Context Engineering as taught in this course?",
    "options": [
      { "id": "a", "text": "Clean Context, Golden U-Curve, External Memory", "correct": True },
      { "id": "b", "text": "System Prompts, Few-shot Examples, Chain of Thought", "correct": False },
      { "id": "c", "text": "Pre-training, Fine-tuning, RAG", "correct": False },
      { "id": "d", "text": "Tokens, Embeddings, Vectors", "correct": False }
    ],
    "explanation": "Context Engineering relies on keeping the context clean, exploiting the U-curve by placing important instructions at the end, and using external memory for large datasets.",
    "source": "Module 2.4: Context Engineering"
  },
  {
    "id": "ext1-mcq-q1-010",
    "moduleId": "2",
    "type": "multiple-choice",
    "difficulty": "medium",
    "tags": ["context-engineering"],
    "prompt": "Why is 'Clean Context' important for an LLM?",
    "options": [
      { "id": "a", "text": "To minimize token costs and reduce the chance of hallucinations caused by irrelevant noise.", "correct": True },
      { "id": "b", "text": "To ensure the LLM generates longer responses.", "correct": False },
      { "id": "c", "text": "To bypass safety filters.", "correct": False },
      { "id": "d", "text": "To increase the temperature of the model.", "correct": False }
    ],
    "explanation": "Extraneous information in the context window increases costs and distracts the model, leading to hallucinations and degraded reasoning.",
    "source": "Module 2.4: Context Engineering"
  },
  {
    "id": "ext1-fill-q1-011",
    "moduleId": "2",
    "type": "fill-blank",
    "difficulty": "easy",
    "tags": ["context-engineering"],
    "prompt": "To exploit the U-curve (Positional Bias), you should place your most important instructions at the very ______ of the prompt.",
    "placeholder": "Type your answer here...",
    "acceptedAnswers": ["end", "bottom"],
    "explanation": "Due to the 'Lost in the Middle' phenomenon, LLMs pay the most attention to the very beginning and the very end of their context window.",
    "source": "Module 2.4: Context Engineering"
  },
  {
    "id": "ext1-mcq-q1-012",
    "moduleId": "2",
    "type": "multiple-choice",
    "difficulty": "easy",
    "tags": ["mcp"],
    "prompt": "What does MCP stand for in the context of external memory?",
    "options": [
      { "id": "a", "text": "Model Context Protocol", "correct": True },
      { "id": "b", "text": "Machine Compute Provider", "correct": False },
      { "id": "c", "text": "Memory Context Pipeline", "correct": False },
      { "id": "d", "text": "Main Control Program", "correct": False }
    ],
    "explanation": "MCP stands for Model Context Protocol, which is an open standard for connecting AI models to external data sources and tools.",
    "source": "Module 2.4: MCP Teaser"
  },
  {
    "id": "ext1-mcq-q1-013",
    "moduleId": "2",
    "type": "multiple-choice",
    "difficulty": "medium",
    "tags": ["mcp"],
    "prompt": "What is the primary purpose of an MCP server?",
    "options": [
      { "id": "a", "text": "To securely connect your AI to external databases, APIs, and file systems.", "correct": True },
      { "id": "b", "text": "To train a new foundational model from scratch.", "correct": False },
      { "id": "c", "text": "To host a web-based chat interface.", "correct": False },
      { "id": "d", "text": "To manage your billing and token usage.", "correct": False }
    ],
    "explanation": "MCPs act as standardized bridges that allow an AI to retrieve live data or take actions on external systems, effectively providing it with 'External Memory'.",
    "source": "Module 2.4: MCP Teaser"
  },
  {
    "id": "ext1-mcq-q1-014",
    "moduleId": "2",
    "type": "multiple-choice",
    "difficulty": "medium",
    "tags": ["markdown-skills"],
    "prompt": "How do 'Markdown Skills' help achieve a Clean Context?",
    "options": [
      { "id": "a", "text": "By organizing highly specific behaviors into modular .md files instead of using one massive, confusing prompt.", "correct": True },
      { "id": "b", "text": "By automatically deleting older messages from the chat history.", "correct": False },
      { "id": "c", "text": "By compressing text using advanced tokenization algorithms.", "correct": False },
      { "id": "d", "text": "By restricting the AI from using Markdown formatting in its output.", "correct": False }
    ],
    "explanation": "Instead of loading every possible instruction into the agent's memory at all times, Markdown Skills allow the agent to dynamically load only the specific instructions it needs for the current task.",
    "source": "Module 2.4: Skills Teaser"
  },
  {
    "id": "ext1-msel-q1-015",
    "moduleId": "2",
    "type": "multiple-select",
    "difficulty": "easy",
    "tags": ["engine-harness"],
    "prompt": "Which of the following are recommended when choosing your 'engine' (foundation model) for agentic workflows? Select all that apply.",
    "selectAllThatApply": True,
    "options": [
      { "id": "a", "text": "Strong function-calling capabilities.", "correct": True },
      { "id": "b", "text": "Generous API access or free tiers for learning.", "correct": True },
      { "id": "c", "text": "Web-only chat interfaces without API access.", "correct": False },
      { "id": "d", "text": "A highly sandboxed environment that restricts tool use.", "correct": False }
    ],
    "explanation": "For agentic workflows, you need a model that can reliably use tools (function-calling) and you need API access to connect it to your harness. Web-only interfaces are usually too restricted.",
    "source": "Module 2.4: Finding Tools"
  },
  {
    "id": "ext1-mcq-q1-016",
    "moduleId": "2",
    "type": "multiple-choice",
    "difficulty": "medium",
    "tags": ["engine-harness"],
    "prompt": "What is the difference between an 'Engine' and a 'Harness'?",
    "options": [
      { "id": "a", "text": "The Engine is the underlying LLM (e.g., Gemini), while the Harness is the application (e.g., Antigravity CLI) that runs the agent and provides access to tools.", "correct": True },
      { "id": "b", "text": "The Engine is the user interface, while the Harness is the database.", "correct": False },
      { "id": "c", "text": "They are interchangeable terms for the same concept.", "correct": False },
      { "id": "d", "text": "The Engine is the hardware GPU, while the Harness is the operating system.", "correct": False }
    ],
    "explanation": "The Engine provides the intelligence (the LLM API), but it needs a Harness (like a CLI or Desktop app) to execute code, read files, and interface with the real world.",
    "source": "Module 2.4: Project Harness"
  },
  {
    "id": "ext1-mcq-q1-017",
    "moduleId": "2",
    "type": "multiple-choice",
    "difficulty": "medium",
    "tags": ["engine-harness"],
    "prompt": "Why might a web-based chat interface (like standard ChatGPT or Gemini web) be insufficient for advanced agentic workflows?",
    "options": [
      { "id": "a", "text": "They are often highly sandboxed and do not allow the AI to execute local CLI commands or freely access your file system.", "correct": True },
      { "id": "b", "text": "They do not use real LLMs.", "correct": False },
      { "id": "c", "text": "They charge per token, whereas local CLI tools do not.", "correct": False },
      { "id": "d", "text": "They have a smaller context window than the API version of the same model.", "correct": False }
    ],
    "explanation": "Web interfaces protect the user by sandboxing the AI. True agentic workflows require local tools (CLI or Desktop harnesses) so the agent can read and write files and execute commands on your machine.",
    "source": "Module 2.4: Web vs Local"
  },
  {
    "id": "ext1-match-q1-018",
    "moduleId": "2",
    "type": "match-pairs",
    "difficulty": "intermediate",
    "tags": ["context-engineering", "mcp", "markdown-skills", "engine-harness"],
    "prompt": "Match the Context Engineering concept to its implementation.",
    "pairs": [
      { "left": "External Memory", "right": "Model Context Protocol (MCP)" },
      { "left": "Clean Context", "right": "Modular Markdown Skills" },
      { "left": "Golden U-Curve", "right": "Placing critical instructions at the end" },
      { "left": "Harness", "right": "Desktop LLM app or CLI" }
    ],
    "explanation": "MCP provides external memory, Markdown skills provide modular clean context, the U-curve dictates instruction placement, and the Harness runs the environment.",
    "source": "Module 2.4 Summary"
  }
]

def q_to_ts(q):
    s = f'  {{\n    id: "{q["id"]}", moduleId: "{q["moduleId"]}", type: "{q["type"]}", difficulty: "{q["difficulty"]}",\n'
    s += f'    tags: {json.dumps(q["tags"])},\n'
    s += f'    prompt: {json.dumps(q["prompt"])},\n'
    
    if q["type"] == "multiple-choice" or q["type"] == "multiple-select":
        if q.get("selectAllThatApply"):
            s += f'    selectAllThatApply: true,\n'
        s += '    options: [\n'
        for i, o in enumerate(q["options"]):
            s += f'      {{ id: "{o["id"]}", text: {json.dumps(o["text"])}, correct: {"true" if o["correct"] else "false"} }}'
            if i < len(q["options"]) - 1:
                s += ',\n'
            else:
                s += '\n'
        s += '    ],\n'
    elif q["type"] == "fill-blank":
        s += f'    placeholder: {json.dumps(q["placeholder"])},\n'
        s += f'    acceptedAnswers: {json.dumps(q["acceptedAnswers"])},\n'
    elif q["type"] == "match-pairs":
        s += '    pairs: [\n'
        for i, p in enumerate(q["pairs"]):
            s += f'      {{ left: {json.dumps(p["left"])}, right: {json.dumps(p["right"])} }}'
            if i < len(q["pairs"]) - 1:
                s += ',\n'
            else:
                s += '\n'
        s += '    ],\n'
        
    s += f'    explanation: {json.dumps(q["explanation"])},\n'
    s += f'    source: {json.dumps(q["source"])}\n  }}'
    return s

ts_blocks = [q_to_ts(q) for q in new_questions]

path = "/home/jitin/AIFoundations/src/lib/question-bank-extended-1.ts"
with open(path, "r") as f:
    content = f.read()

# Insert before Batch 1
marker = "  // ========================================================================\n  // BATCH 1:"
if marker in content:
    insertion = ",\n".join(ts_blocks) + ",\n\n"
    new_content = content.replace(marker, insertion + marker)
    with open(path, "w") as f:
        f.write(new_content)
    print("Injected successfully.")
else:
    print("Marker not found!")
