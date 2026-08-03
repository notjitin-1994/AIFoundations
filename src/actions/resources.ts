"use server"

import { createClient } from "@/lib/supabase/server"

export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
}

export async function fetchPromptTemplates(): Promise<PromptTemplate[]> {
  const supabase = await createClient()
  
  // Attempt to fetch from the prompt_templates table
  const { data, error } = await supabase
    .from('prompt_templates')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error || !data || data.length === 0) {
    if (error) console.error("Error fetching prompt templates from database:", error)
    // Fallback templates provided by the course
    return [
      {
        id: "template-1",
        category: "System Design",
        title: "Product Requirements to Architecture",
        description: "Convert a high-level product idea into a concrete software architecture plan that an AI can understand.",
        content: `I have a high-level concept for an application: [Insert idea here].

Please act as an expert Systems Architect. Break this idea down into:
1. Core features (MVP scope)
2. Frontend stack recommendations (framework, styling)
3. Backend & API requirements (database schema, key endpoints)
4. Recommended 3rd-party integrations (auth, payments, etc.)

Present this in a structured markdown format that I can feed into a coding agent to begin implementation.`
      },
      {
        id: "template-2",
        category: "Data Modeling",
        title: "Database Schema Generator",
        description: "Design a relational database schema optimized for your specific application domain.",
        content: `I am building a [Insert app type, e.g., SaaS platform for dentists]. 

I need a robust relational database schema designed for Postgres. Please provide:
1. A list of core tables with their columns, data types, and primary/foreign keys.
2. An explanation of the relationships (1-to-many, many-to-many).
3. The SQL commands to generate these tables.
4. Any recommended indexes for performance.`
      },
      {
        id: "template-3",
        category: "Agent Instructions",
        title: "Subagent Persona Definition",
        description: "Define a strict system prompt to constrain a specialized AI subagent.",
        content: `You are an expert [Insert Role, e.g., UX/UI Frontend Developer].
Your primary goal is to [Insert Goal, e.g., build beautiful, accessible React components].

Rules you must follow:
- Always use [Insert Tech, e.g., Tailwind CSS and Radix UI].
- Never write backend or database logic.
- Ensure all components are fully responsive.
- Prioritize clean, readable code with minimal dependencies.

Acknowledge your role and await your first task.`
      },
      {
        id: "template-4",
        category: "Debugging",
        title: "Systematic Bug Isolation",
        description: "Prompt an AI to act as a senior debugging partner when you are stuck.",
        content: `I am encountering an error in my [Insert Tech, e.g., Next.js] application.

Error message:
[Paste exact error message]

Relevant code snippet:
[Paste code here]

Do not just rewrite the code blindly. Instead, act as a Senior Engineer and:
1. Explain what the error means in plain English.
2. List 3 plausible root causes.
3. Tell me exactly what log or test I should run next to isolate which cause it is.`
      },
      {
        id: "template-5",
        category: "Feature Scoping",
        title: "User Story Extraction",
        description: "Translate a vague feature request into actionable user stories for development.",
        content: `I want to build a feature where [Describe feature, e.g., users can collaborate on a document in real-time].

Please translate this into agile User Stories in the format:
"As a [User Persona], I want to [Action], so that [Benefit]."

For each user story, also provide 3 Acceptance Criteria that a developer must satisfy for the story to be considered complete.`
      }
    ];
  }
  
  return data as PromptTemplate[];
}
