"use client";

import { use, Suspense, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LessonViewer } from "@/components/lesson/lesson-viewer";
import { useProgressStore } from "@/store/progress";
import { sendXAPIStatement } from "@/actions/xapi";
import { fetchModuleProgress } from "@/actions/sync-progress";
import { useSyncEngine } from "@/hooks/use-sync-engine";

import { MODULE_1_SLIDES } from "@/components/modules/m1";
import { MODULE_2_SLIDES } from "@/components/modules/m2";
import { MODULE_3_SLIDES } from "@/components/modules/m3";
import { MODULE_4_SLIDES } from "@/components/modules/m4";
import { MODULE_5_SLIDES } from "@/components/modules/m5";
import { MODULE_6_SLIDES } from "@/components/modules/m6";
import { CanvasViewer } from "@/components/lesson/canvas-viewer";

// Mock lesson content for now
const LESSONS: Record<string, any> = {
  // Module 2 is now built out natively
};

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { markModuleComplete, setActiveLessonIndex, setActiveSlideProgress, projectSpine } = useProgressStore();

  useSyncEngine(moduleId);

  // Must be at top level — Rules of Hooks. Used only when moduleId === "5".
  const m5Slides = useMemo(() => {
    if (projectSpine) {
      return MODULE_5_SLIDES
        .filter(s => s.id.includes(`m5-${projectSpine}-`))
        .map((s, index) => ({
          ...s,
          lessonIndex: index === 0 ? 0 : index - 1
        }));
    }
    return MODULE_5_SLIDES;
  }, [projectSpine]);

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

    const nextModuleNum = parseInt(moduleId, 10) + 1;
    if (nextModuleNum <= 6) {
      router.push(`/courses/aifoundations-concept2application/modules/${nextModuleNum}`);
    } else {
      router.push(`/courses/aifoundations-concept2application/certificate`);
    }
  };

  if (moduleId === "1") {
    return (
      <Suspense fallback={<div>Loading lesson...</div>}>
        <CanvasViewer 
          slides={MODULE_1_SLIDES} 
          onComplete={handleComplete} 
          moduleId={moduleId}
        />
      </Suspense>
    );
  }

  if (moduleId === "2") {
    return (
      <Suspense fallback={<div>Loading lesson...</div>}>
        <CanvasViewer 
          slides={MODULE_2_SLIDES} 
          onComplete={handleComplete} 
          moduleId={moduleId}
        />
      </Suspense>
    );
  }

  if (moduleId === "3") {
    return (
      <Suspense fallback={<div>Loading lesson...</div>}>
        <CanvasViewer 
          slides={MODULE_3_SLIDES} 
          onComplete={handleComplete} 
          moduleId={moduleId}
        />
      </Suspense>
    );
  }

  if (moduleId === "4") {
    return (
      <Suspense fallback={<div>Loading lesson...</div>}>
        <CanvasViewer slides={MODULE_4_SLIDES} onComplete={handleComplete} moduleId={moduleId} />
      </Suspense>
    );
  }

  if (moduleId === "5") {
    return (
      <Suspense fallback={<div>Loading lesson...</div>}>
        <CanvasViewer slides={m5Slides} onComplete={handleComplete} moduleId={moduleId} />
      </Suspense>
    );
  }

  if (moduleId === "6") {
    return (
      <Suspense fallback={<div>Loading lesson...</div>}>
        <CanvasViewer slides={MODULE_6_SLIDES} onComplete={handleComplete} moduleId={moduleId} />
      </Suspense>
    );
  }

  // Fallback for unbuilt modules
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
