"use client";

import React, { useState } from "react";
import { Code, Server, Database, Cpu, Wrench, FileCode2, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTitle as DialogTitlePrimitive } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";

const BASELINE_ITEMS = [
  {
    id: "software-fundamentals",
    title: "Software Development Fundamentals",
    shortDesc: "The core mental models of how software is built and versioned.",
    icon: Code,
    overview: "Before an AI can build an app for you, you must understand the building blocks. Software development fundamentals encompass computational thinking, logic flow (loops, conditionals), version control (Git), and debugging strategies.",
    prerequisites: [
      "Understand how code is executed sequentially and asynchronously.",
      "Know how to isolate bugs and write minimal reproducible examples.",
      "Understand Git versioning (branches, commits, merges) to safely iterate on AI-generated code."
    ]
  },
  {
    id: "frontend-basics",
    title: "Frontend Basics",
    shortDesc: "How user interfaces are constructed and rendered.",
    icon: FileCode2,
    overview: "Frontend development is about bridging data and user interaction. While AI can write a React component, you need to know where it fits into the layout hierarchy and how it manages state.",
    prerequisites: [
      "The DOM tree and basic HTML/CSS mental models.",
      "Component architecture (props, state, and lifecycle).",
      "How to read and debug browser developer tools."
    ]
  },
  {
    id: "backend-apis",
    title: "Backend & APIs",
    shortDesc: "Handling requests, RESTful routing, and payloads.",
    icon: Server,
    overview: "Backends are the engines of the web. They handle stateless requests, secure logic, and interface with databases. AI often needs to \"call an API\", and you must explicitly define how that handshake works.",
    prerequisites: [
      "RESTful concepts: GET vs POST, headers, and status codes.",
      "Understanding JSON structures and serialization.",
      "Authentication flows (JWTs, API keys) to secure your endpoints."
    ]
  },
  {
    id: "data-stores",
    title: "Data Stores",
    shortDesc: "Relational SQL vs document-based NoSQL persistence.",
    icon: Database,
    overview: "Data needs to live somewhere. When prompting AI to build a feature, you must explicitly define the schema and the relationships so it doesn't hallucinate impossible database queries.",
    prerequisites: [
      "Relational (SQL) vs Document (NoSQL) paradigms.",
      "What a schema is and why strong typing matters.",
      "Basic concepts of vector embeddings for AI semantic search."
    ]
  },
  {
    id: "programmatic-development",
    title: "Programmatic Development (Code & Content)",
    shortDesc: "Automating logic and gluing AI outputs together.",
    icon: Wrench,
    overview: "AI outputs are raw text. Programmatic development is the \"glue code\" that takes that text, parses it, and feeds it into the next step of your pipeline. You must know how to chain these operations.",
    prerequisites: [
      "Basic scripting logic in Python, TypeScript, or bash.",
      "Handling asynchronous operations and promises.",
      "Managing API rate limits and structured data parsing (JSON schemas)."
    ]
  },
  {
    id: "llm-fundamentals",
    title: "LLM Fundamentals",
    shortDesc: "Tokens, context windows, and probabilistic generation.",
    icon: Cpu,
    overview: "Large Language Models are not databases; they are probabilistic reasoning engines. Understanding how they actually process text is the only way to write robust prompts and avoid hallucinations.",
    prerequisites: [
      "Tokens vs words, and managing context window limits.",
      "System prompts vs user prompts and role-playing.",
      "Understanding temperature, top-p, and non-deterministic outputs."
    ]
  }
];

export function BaselineCards() {
  const [selectedItem, setSelectedItem] = useState<typeof BASELINE_ITEMS[0] | null>(null);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BASELINE_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="bg-card/60 p-4 rounded-xl border border-white/5 flex gap-4 text-left group hover:bg-card/80 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(167,218,219,0.05)] transition-all active:scale-[0.98]"
            >
              <div className="shrink-0 bg-primary/10 p-2.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors flex justify-between items-center">
                  {item.title}
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h4>
                <p className="text-xs text-muted-foreground">{item.shortDesc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md bg-[#020C1B] border-white/10 shadow-2xl overflow-hidden p-0 gap-0">
          {/* Glassmorphic glow effect */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          {/* Note: AnimatePresence allows elements to exit animate. */}
          <AnimatePresence mode="wait">
            {selectedItem && (
              <motion.div 
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 p-6"
              >
                <DialogHeader className="mb-6 text-left">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <selectedItem.icon className="w-6 h-6 text-primary" />
                  </div>
                  <DialogTitle className="text-2xl font-heading font-bold text-white">{selectedItem.title}</DialogTitle>
                  <DialogDescription className="text-base text-white/70 mt-2 leading-relaxed">
                    {selectedItem.overview}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-primary/80">Core Prerequisites</h5>
                  <ul className="space-y-3">
                    {selectedItem.prerequisites.map((req, i) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        key={i} 
                        className="flex gap-3 text-sm text-white/80 bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(167,218,219,0.8)]" />
                        <span className="leading-relaxed">{req}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
