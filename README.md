# AI Foundations: Concept to Application

**AI Foundations** is a custom, interactive e-learning web application designed to teach AI literacy to non-technical professionals. Instead of traditional video lectures, this project uses a highly interactive, voiceover-narrated slide deck engine built on Next.js 16 (App Router), React 19, and Framer Motion.

## 🚀 Features

- **Custom Slide Engine (`CanvasViewer`)**: A bespoke interactive presentation engine with voiceover synchronization, GSAP timelines, and Framer Motion transitions.
- **6 Comprehensive Modules**: From "The Intelligence Illusion" to "The Horizon", teaching concepts like tokens, context windows, RAG, and agentic workflows.
- **Project-Based Learning**: Learners choose from 12 project templates in Module 0 and build upon them throughout the course.
- **Rich Assessment System (`AssessmentRunner`)**: A built-in knowledge check engine powered by a centralized question bank.
- **xAPI Integration**: Granular telemetry tracking learner progress, answers, and interactions to a Learning Record Store.
- **Modern Tech Stack**: Next.js 16, React 19, Zustand (Persist), Shadcn UI, Tailwind CSS v4, GSAP, and Motion.

## 📚 Key Documentation

Before contributing to this codebase, you **must** read the following documents:

1. **[AGENTS.md](./AGENTS.md)**: The canonical development guide and instruction set for AI agents (and human developers) working on this codebase.
2. **[STYLE.md](./STYLE.md)**: The global design system, covering the "two-accent rule", glassmorphism ideology, and the critical "canvas-fit HARD rule".
3. **[AI-Foundations-Concept2Application-Blueprint.md](./AI-Foundations-Concept2Application-Blueprint.md)**: The comprehensive course design blueprint detailing learning objectives and module structures.

## 🛠️ Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
The main entry point for the course is `src/app/page.tsx` (Module 0) which routes into `src/app/modules/[id]/page.tsx` for Modules 1-6.

## 📁 Architecture Overview

- `src/app/`: Next.js App Router (Layouts, pages, modules)
- `src/components/lesson/`: Core lesson components (`CanvasViewer`, `AssessmentRunner`)
- `src/components/modules/`: Slide definitions for each module (`m1` through `m6`)
- `src/components/ui/`: Shadcn UI components
- `src/store/`: Zustand stores for progress and narration state
- `src/lib/`: Utilities, constants, and the `question-bank.ts`
- `public/audio/`: Voiceover MP3s synced to slides

---
*Built for the AI-literate professional of tomorrow.*
