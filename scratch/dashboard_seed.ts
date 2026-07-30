export function getSeededAnswers(spine: string) {
  if (spine === "content-engine") {
    return {
      "1": { rolePrompt: "# System Prompt\n\nYou are an expert content strategist and SEO writer.\n\n*(Mock artifact auto-populated for testing)*" },
      "2": { contextPrompt: "# Context Engineering\n\nPlease reference the following brand guidelines and tone documents:\n1. Voice & Tone\n2. Keyword Strategy\n\n*(Mock artifact auto-populated for testing)*" },
      "3": { agentsMd: "# Agent Orchestration\n\n```yaml\nagents:\n  - name: Outliner\n    role: Creates headers\n  - name: Drafter\n    role: Writes prose\n```\n\n*(Mock artifact auto-populated for testing)*" }
    };
  } else if (spine === "creative-studio") {
    return {
      "1": { rolePrompt: "# System Prompt\n\nYou are a visionary creative director and image prompt specialist.\n\n*(Mock artifact auto-populated for testing)*" },
      "2": { contextPrompt: "# Context Engineering\n\nPlease reference the following visual style constraints:\n1. Color Palette\n2. Aspect Ratio Rules\n\n*(Mock artifact auto-populated for testing)*" },
      "3": { agentsMd: "# Agent Orchestration\n\n```yaml\nagents:\n  - name: ConceptArtist\n    role: Ideates visuals\n  - name: PromptRefiner\n    role: Optimizes for Midjourney\n```\n\n*(Mock artifact auto-populated for testing)*" }
    };
  }
  return {
    "1": { rolePrompt: "# System Prompt\n\nYou are an expert research assistant. Your goal is to analyze data and provide structured insights.\n\n*(Mock artifact auto-populated for testing)*" },
    "2": { contextPrompt: "# Context Engineering\n\nPlease reference the following knowledge base articles to formulate your answer:\n1. Architecture Guidelines\n2. API Spec v2\n\n*(Mock artifact auto-populated for testing)*" },
    "3": { agentsMd: "# Agent Orchestration\n\n```yaml\nagents:\n  - name: Researcher\n    role: Gathers data\n  - name: Writer\n    role: Formats output\n```\n\n*(Mock artifact auto-populated for testing)*" }
  };
}
