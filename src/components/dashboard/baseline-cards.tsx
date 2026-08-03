"use client";

import React, { useState } from "react";
import { Code, Server, Database, Cpu, Wrench, FileCode2, ArrowRight, Copy, CheckCircle2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";

const BASELINE_ITEMS = [
  {
    id: "software-fundamentals",
    title: "Software Development Fundamentals",
    shortDesc: "The core mental models of designing systems and apps using AI.",
    icon: Code,
    overview: "We aren't talking about traditional coding. For an AI-driven builder, software development is about designing robust systems. You need to know how to architect a solution that an AI can write, how to version it, and how to safely deploy it.",
    prerequisites: [
      "Understanding system architecture and logic flow at a high level.",
      "How to design modular systems that AI can tackle in smaller pieces.",
      "Basic concepts of version control and deployment environments."
    ],
    prompt: "I am a non-technical founder learning to build apps using AI. Explain the core software development fundamentals I need to know. Do not teach me syntax or traditional coding (loops/conditionals). Instead, teach me the mental models of system architecture, modular design, version control, and deployment pipelines, explained in simple analogies."
  },
  {
    id: "frontend-basics",
    title: "Frontend Basics",
    shortDesc: "Visual design, aesthetics, and UX fundamentals.",
    icon: FileCode2,
    overview: "Frontend is the face of your application. While AI can write the UI components, you must dictate the visual design. Knowing what makes an interface look premium and intuitive ensures you don't end up with generic, sloppy AI outputs.",
    prerequisites: [
      "Core principles of typography, spacing, and visual hierarchy.",
      "Understanding UX patterns and reducing cognitive load.",
      "Aesthetics of modern design (glassmorphism, micro-interactions, responsive layouts)."
    ],
    prompt: "I am a non-technical builder creating apps with AI. Teach me the fundamentals of modern frontend design, UX, and aesthetics. Focus on visual hierarchy, typography, spacing, and micro-interactions. Give me the vocabulary I need to instruct an AI to generate premium, world-class, non-generic interfaces."
  },
  {
    id: "backend-apis",
    title: "Backend & APIs",
    shortDesc: "Understanding the server, its functions, and API calls.",
    icon: Server,
    overview: "The backend is the engine of your app. You must understand what a server is capable of doing, how it processes logic securely, and how different systems talk to each other using API calls.",
    prerequisites: [
      "What a server actually is and the types of logic it handles.",
      "The definition of an API call and how systems handshake.",
      "Types of API requests (e.g., fetching data vs. sending data)."
    ],
    prompt: "I am a non-technical builder creating apps with AI. Explain what a backend 'server' is and what its core functions are. Then, break down what an API call is, the different types of API calls (GET, POST, etc.), and how frontends communicate with backends. Use simple, real-world analogies."
  },
  {
    id: "data-stores",
    title: "Data Stores",
    shortDesc: "Where data is persisted and structured.",
    icon: Database,
    overview: "If the frontend is the UX and the backend is the engine, the data store is the memory. It's where all the data displayed by the frontend and manipulated by the backend is permanently saved.",
    prerequisites: [
      "How frontend, backend, and data stores interact.",
      "The difference between relational (SQL) and document (NoSQL) databases.",
      "How to choose the right type of data store for your specific product."
    ],
    prompt: "I am a non-technical builder creating apps with AI. Explain the concept of data stores (databases). Explain the relationship between the frontend (UX), the backend (engine), and the data store (memory). Then, break down the different types of databases (SQL vs NoSQL) and how to choose the best one for my product."
  },
  {
    id: "programmatic-development",
    title: "Programmatic Development (Code & Content)",
    shortDesc: "Using AI to write code and generate content.",
    icon: Wrench,
    overview: "You don't need to write the code yourself, but you do need to drive the AI. Programmatic development is the skill of using an AI agent and its harness to systematically write code, create content, and build out your vision.",
    prerequisites: [
      "Understanding how to prompt AI for structural code generation.",
      "Iterating and chaining AI outputs programmatically.",
      "Managing an AI agent's context and workflow harness."
    ],
    prompt: "I am a non-technical builder creating apps with AI. Explain the concept of programmatic development using AI agents. Teach me how to use an AI harness to systematically generate code and content, how to chain outputs, and how to drive an AI agent to build complex features step-by-step."
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
    ],
    prompt: "I am learning how to harness Large Language Models. Explain the core mechanics of LLMs in simple terms. Cover tokens, context windows, system vs. user prompts, and generation parameters like temperature. Help me understand why they hallucinate and how they predict the next word."
  }
];

function CopyPrompt({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8">
      <h5 className="text-xs font-bold uppercase tracking-widest text-primary/80 mb-3">Learning Brainstorm Prompt</h5>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
        <div className="relative bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col gap-4">
          <p className="text-sm text-white/70 italic font-mono leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">"{prompt}"</p>
          <button 
            onClick={handleCopy}
            className="self-end flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-4 py-2 rounded-lg transition-colors active:scale-95"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied to Clipboard" : "Copy Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
              className="bg-card/60 p-5 rounded-xl border border-white/5 flex gap-4 text-left group hover:bg-card/80 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(167,218,219,0.05)] transition-all active:scale-[0.98]"
            >
              <div className="shrink-0 pt-0.5">
                <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 flex flex-col justify-start">
                <h4 className="font-bold text-sm mb-1.5 group-hover:text-primary transition-colors flex justify-between items-start">
                  <span className="leading-tight">{item.title}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all mt-0.5 shrink-0" />
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.shortDesc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-xl bg-[#020C1B] border-white/10 shadow-2xl overflow-hidden p-0 gap-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <AnimatePresence mode="wait">
            {selectedItem && (
              <motion.div 
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 p-6 md:p-8"
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <DialogHeader className="mb-6 text-left pr-8">
                  <div className="mb-5">
                    <selectedItem.icon className="w-8 h-8 text-primary" />
                  </div>
                  <DialogTitle className="text-2xl font-heading font-bold text-white">{selectedItem.title}</DialogTitle>
                  <DialogDescription className="text-base text-white/70 mt-3 leading-relaxed">
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

                <CopyPrompt prompt={selectedItem.prompt} />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
