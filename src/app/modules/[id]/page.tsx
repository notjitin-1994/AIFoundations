"use client";

import { use } from "react";
import { LessonViewer } from "@/components/lesson/lesson-viewer";
import { useProgressStore } from "@/store/progress";
import { sendXAPIStatement } from "@/actions/xapi";

import { MODULE_1_SLIDES } from "@/components/modules/m1";
import { CanvasViewer } from "@/components/lesson/canvas-viewer";

// Mock lesson content for now
const LESSONS: Record<string, any> = {
  "2": {
    title: "2. The Goldfish Problem",
    videoUrl: "https://www.youtube.com/watch?v=jGwO_UgTS7I",
    content: `
## Managing the Context Window

Language models suffer from "The Goldfish Problem" — they have no persistent memory between sessions unless you manage their context window effectively.

### What you will learn

1. **Information Retrieval**: How to pass the right documents into the context window.
2. **System Prompts**: Setting the persistent behavior and constraints for your agent.
3. **RAG (Retrieval-Augmented Generation)**: The foundation of modern AI applications.
    `
  }
};

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.id;
  const { markModuleComplete } = useProgressStore();

  const handleComplete = async () => {
    markModuleComplete(moduleId);
    
    // Fire xAPI Statement
    await sendXAPIStatement(
      "http://adlnet.gov/expapi/verbs/completed",
      "completed_module",
      `http://smartslate.com/activities/modules/${moduleId}`,
      `Module ${moduleId}`,
      `Learner completed module ${moduleId}`
    );
  };

  if (moduleId === "1") {
    return (
      <CanvasViewer 
        slides={MODULE_1_SLIDES} 
        onComplete={handleComplete} 
        moduleId={moduleId}
      />
    );
  }

  // Fallback for other modules
  const lesson = LESSONS[moduleId];

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-8 md:p-12">
        <h1 className="text-3xl text-primary font-bold">Module {moduleId}</h1>
        <p className="text-muted-foreground mt-4">Content for this module has not been authored yet.</p>
      </div>
    );
  }

  return (
    <LessonViewer 
      title={lesson.title} 
      markdownContent={lesson.content} 
      videoUrl={lesson.videoUrl} 
      onVideoComplete={handleComplete} 
      moduleId={moduleId}
    />
  );
}
