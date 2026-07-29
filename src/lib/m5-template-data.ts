export interface TemplateData {
  id: string;
  title: string;
  description: string;
  harnessChecklist: string[];
  toolsetChecklist: string[];
  contextRevamp: { before: string; after: string; title: string };
  promptRevamp: { before: string; after: string };
}

export const M5_TEMPLATE_DATA: TemplateData[] = [
  {
    id: "bi_dashboard",
    title: "Dynamic BI Dashboard",
    description: "Generative UI dashboard for querying live data visually.",
    harnessChecklist: [
      "Next.js App Router workspace initialized",
      "Tailwind CSS configured for generative charts",
      "Supabase connection string secured in .env"
    ],
    toolsetChecklist: [
      "SQL Query Generator Skill",
      "Postgres Database MCP Server",
      "Recharts JSON formatter MCP"
    ],
    contextRevamp: {
      title: "Data Schema Context",
      before: "You are an AI that writes SQL. The database has users and sales.",
      after: "You are a BI architect. Current Schema: [TABLE_DEFS]. You MUST output strictly typed JSON compatible with Recharts. Never execute DROP or DELETE commands."
    },
    promptRevamp: {
      before: "Show me sales for last month.",
      after: "Execute a read-only query for MRR grouped by day for the last 30 days. Format the response as a JSON array of objects with 'date' and 'mrr' keys. If data is sparse, interpolate with 0s."
    }
  },
  {
    id: "dynamic_onboarding",
    title: "Conversational Onboarding",
    description: "Dynamic form generation based on conversational input.",
    harnessChecklist: [
      "React state management for form progressive disclosure",
      "Vercel AI SDK streaming configured",
      "shadcn/ui form components installed"
    ],
    toolsetChecklist: [
      "JSON Schema Validator MCP",
      "Zod Type Generation Skill",
      "Memory Context MCP"
    ],
    contextRevamp: {
      title: "User State Context",
      before: "Ask the user questions to onboard them.",
      after: "You are an onboarding agent. The user's current known state is [USER_STATE_JSON]. Only ask exactly ONE question at a time to fill the missing required fields: [MISSING_FIELDS]. Output the next UI component to render."
    },
    promptRevamp: {
      before: "What is your company size?",
      after: "Analyze the user's last message: 'We are a small startup with 5 people'. Extract company_size=5. Update the context store. Generate the next logical question regarding their industry sector."
    }
  },
  {
    id: "hitl_control_center",
    title: "Human-in-the-Loop Control Center",
    description: "A web interface to monitor agentic loop engineering, allowing humans to review, steer, and approve automated tasks.",
    harnessChecklist: [
      "WebSocket server for real-time agent logging",
      "Cryptographic signing utility for approvals",
      "Next.js admin dashboard layout"
    ],
    toolsetChecklist: [
      "Agent execution trace MCP",
      "Slack Notification MCP",
      "Approval State Machine Skill"
    ],
    contextRevamp: {
      title: "Approval Context",
      before: "Tell me what the agent did.",
      after: "You are a Risk Assessment evaluator. The agent proposes the following execution trace: [EXEC_TRACE]. Identify any destructive operations (DROP, DELETE, OVERWRITE). If risk > threshold, emit a 'REQUIRES_APPROVAL' signal."
    },
    promptRevamp: {
      before: "Approve this task.",
      after: "Validate the cryptographic signature of the approval payload. If valid, release the execution lock for task ID [TASK_ID] and stream the stdout back to the console."
    }
  },
  {
    id: "os_assistant",
    title: "OS-Level Workflow Assistant",
    description: "Desktop agent that integrates with the OS to summarize documents and draft messages natively.",
    harnessChecklist: [
      "Tauri or Electron scaffold initialized",
      "Rust/Node.js file system bridge active",
      "Global hotkey listener registered"
    ],
    toolsetChecklist: [
      "Local File System MCP",
      "AppleScript / PowerShell execution Skill",
      "Active Window Context MCP"
    ],
    contextRevamp: {
      title: "Desktop Context",
      before: "Read the file and summarize.",
      after: "You are a local OS assistant. The user's currently active window is [ACTIVE_WINDOW_TITLE]. You have read access to [WORKSPACE_DIR]. Maintain strict privacy—do not log PII to external servers."
    },
    promptRevamp: {
      before: "Draft an email about this document.",
      after: "Read the contents of the currently highlighted PDF via the File System MCP. Extract the core arguments and draft a 3-paragraph email in Apple Mail using the AppleScript execution skill."
    }
  },
  {
    id: "edge_health_coach",
    title: "Edge-AI Health Coach",
    description: "Smartphone app running local small models to securely interpret raw wearable data without cloud processing.",
    harnessChecklist: [
      "React Native / Expo scaffold initialized",
      "ONNX runtime or local LLM execution engine configured",
      "HealthKit / Google Fit API permissions granted"
    ],
    toolsetChecklist: [
      "Health Data Aggregator MCP",
      "Local SLM Context window optimizer",
      "Biometric Anomaly Detection Skill"
    ],
    contextRevamp: {
      title: "Biometric Context",
      before: "Look at the user's heart rate.",
      after: "You are a local edge AI. Current sensor stream: [HRV_DATA], [SLEEP_STAGES]. All processing MUST remain on-device. Your goal is to identify patterns correlating sleep debt with HRV drops."
    },
    promptRevamp: {
      before: "Why am I tired?",
      after: "Analyze the last 72 hours of biometric telemetry. Correlate the drop in deep sleep on Tuesday with the elevated resting heart rate on Wednesday. Output a single actionable lifestyle adjustment."
    }
  },
  {
    id: "internal_rag_agent",
    title: "Enterprise Knowledge Navigator",
    description: "An internal RAG application that securely grounds AI answers in private company documentation and wikis.",
    harnessChecklist: [
      "Vector database (Pinecone/Weaviate) provisioned",
      "Embedding model pipeline configured",
      "SSO/SAML authentication layer active"
    ],
    toolsetChecklist: [
      "Confluence/Notion API MCP",
      "Semantic Search & Re-ranking Skill",
      "Citation Generator MCP"
    ],
    contextRevamp: {
      title: "RAG Context",
      before: "Answer the question using the docs.",
      after: "You are an enterprise knowledge assistant. Synthesize an answer strictly using the provided vector chunks: [VECTOR_CHUNKS]. You MUST append inline citations [DocID] for every factual claim. If the answer is not in the chunks, state 'Insufficient knowledge'."
    },
    promptRevamp: {
      before: "What is our vacation policy?",
      after: "Extract the exact accrued PTO limits for Tier 2 employees from chunk [HR-2023-V2]. Format the response as a bulleted list. Do not hallucinate external standard practices."
    }
  },
  {
    id: "synthetic_podcast_generator",
    title: "Synthetic Podcast Generator",
    description: "Pipeline that ingests dense documents and orchestrates a multi-speaker synthetic audio podcast summarizing key points.",
    harnessChecklist: [
      "Audio orchestration engine (FFmpeg) setup",
      "ElevenLabs/OpenAI TTS API configured",
      "Document parsing service (LlamaParse) active"
    ],
    toolsetChecklist: [
      "Multi-Speaker TTS MCP",
      "Document Chunking Skill",
      "Audio Stitching MCP"
    ],
    contextRevamp: {
      title: "Audio Script Context",
      before: "Make a podcast script about this report.",
      after: "You are an AI podcast orchestrator. Source document: [PDF_TEXT]. Create a 2-minute script featuring Host A (enthusiastic) and Host B (analytical). Output in standard XML tags <host_a> and <host_b>."
    },
    promptRevamp: {
      before: "Read this script aloud.",
      after: "Parse the XML script. Send <host_a> dialogue to Voice ID 1 and <host_b> dialogue to Voice ID 2. Stitch the resulting audio files sequentially with a 0.5s pause between speakers."
    }
  },
  {
    id: "viral_clip_engine",
    title: "Longform-to-Viral Clip Engine",
    description: "Autonomous pipeline that extracts podcast highlights, generates synthetic B-roll, and adds kinetic typography.",
    harnessChecklist: [
      "Audio transcription pipeline (Whisper) active",
      "Motion graphics template library (JSON/Lottie)",
      "TikTok/Reels Auto-Publishing API configured"
    ],
    toolsetChecklist: [
      "Transcript Analyzer MCP",
      "Kinetic Typography Skill",
      "B-Roll Generator (Runway/Sora) MCP"
    ],
    contextRevamp: {
      title: "Viral Heuristics Context",
      before: "Find the best parts of the video.",
      after: "You are a viral retention engineer. Analyze the transcript [FULL_TRANSCRIPT]. Identify 3 contiguous segments (30-60s) where the semantic density and emotional polarity peak. Mark timestamps."
    },
    promptRevamp: {
      before: "Make a short clip.",
      after: "Extract segment [TS_04:15-05:05]. Format the text for kinetic typography (max 4 words per line). Generate a prompt for the B-Roll MCP to overlay visual context during the quiet audio sections."
    }
  },
  {
    id: "global_localization",
    title: "Zero-Touch Localization Engine",
    description: "Pipeline that translates master videos, generates localized audio, and perfectly lip-syncs the original speaker.",
    harnessChecklist: [
      "DeepL or Google Translate API configured",
      "Multilingual Voice Cloning Engine ready",
      "Audio-video muxing utility (FFmpeg) active"
    ],
    toolsetChecklist: [
      "Context-Aware Translation MCP",
      "Audio Stem Separator Skill",
      "Lip-Sync Generation MCP"
    ],
    contextRevamp: {
      title: "Localization Context",
      before: "Translate the script to French.",
      after: "You are a cinematic localization agent. Source text: [TEXT]. Target Language: [LANG]. Translate the text preserving colloquial idioms and ensuring the syllable count closely matches the original timing for optimal lip-sync."
    },
    promptRevamp: {
      before: "Dub the video.",
      after: "Separate the vocal stem from the background music. Translate the vocal transcript to German. Generate the German audio clone. Run the Lip-Sync MCP. Remux the new video with the original background music stem."
    }
  },
  {
    id: "multichannel_repurposing",
    title: "Omnichannel Content Repurposer",
    description: "A single-input engine that transforms messy voice memos or transcripts into polished blogs, newsletters, and social carousels.",
    harnessChecklist: [
      "Webhook receiver for incoming voice memos",
      "Markdown parser and CMS (Sanity/Ghost) API active",
      "Image generation API (Midjourney/DALL-E) wired"
    ],
    toolsetChecklist: [
      "Platform Formatting Skill (LinkedIn, Twitter, Blog)",
      "SEO Keyword Extraction MCP",
      "Carousel Image Generator MCP"
    ],
    contextRevamp: {
      title: "Omnichannel Context",
      before: "Turn this audio into posts.",
      after: "You are an omnichannel ghostwriter. Source material: [MESSY_TRANSCRIPT]. Brand Voice: [VOICE_GUIDELINES]. Do not invent facts. Transform this single source into: 1x 1500-word SEO blog, 1x 5-slide LinkedIn carousel, and 1x Twitter thread."
    },
    promptRevamp: {
      before: "Write a twitter thread.",
      after: "Extract the 4 main counter-intuitive points from the transcript. Draft a 5-part Twitter thread. The first tweet must have a 'hook' and a 'promise'. The final tweet must be a CTA. Ensure no tweet exceeds 280 characters."
    }
  },
  {
    id: "academic_literature_reviewer",
    title: "Academic Research Synthesizer",
    description: "Ingest folders of PDFs and extract core methodologies to autonomously draft structured literature reviews with citations.",
    harnessChecklist: [
      "PDF parsing engine (PyPDF/Grobid) configured",
      "Vector store for cross-document retrieval",
      "LaTeX or Word generation utility active"
    ],
    toolsetChecklist: [
      "Citation Standardizer (APA/MLA) Skill",
      "Methodology Extractor MCP",
      "Cross-Reference Validation MCP"
    ],
    contextRevamp: {
      title: "Academic Context",
      before: "Summarize these papers.",
      after: "You are a postdoctoral research assistant. Papers provided: [PDF_TEXT_ARRAY]. Extract the precise n-size, methodology, and p-values. Compare the conflicting conclusions between Paper A and Paper B with strict academic neutrality."
    },
    promptRevamp: {
      before: "Write a lit review.",
      after: "Synthesize the provided papers into a thematic literature review. Group by methodological approach rather than chronological order. Every claim MUST be followed by an inline citation mapped to the provided bibliography JSON."
    }
  },
  {
    id: "fiction_world_copilot",
    title: "Creative World-Building Co-Pilot",
    description: "A drafting assistant that references a persistent lore bible to ensure character voices and story logic remain perfectly consistent.",
    harnessChecklist: [
      "Graph database (Neo4j) for entity relationships",
      "Long-context window model configured",
      "Rich-text editor integration"
    ],
    toolsetChecklist: [
      "Lore Bible Query MCP",
      "Character Voice Consistency Skill",
      "Timeline Validation MCP"
    ],
    contextRevamp: {
      title: "World-Building Context",
      before: "Write the next chapter.",
      after: "You are a co-author. Current Scene: [SCENE]. Lore constraints: [MAGIC_SYSTEM_RULES], [CHARACTER_RELATIONSHIPS]. Ensure the protagonist's dialogue aligns with their defined 'cynical but loyal' archetype. Do not violate the established timeline."
    },
    promptRevamp: {
      before: "They fight the dragon.",
      after: "Query the Lore Bible for the 'Dragon's weakness'. Draft a 500-word action sequence where the protagonist exploits this specific weakness. Ensure the geography matches the previously established map of the cavern."
    }
  }
];
