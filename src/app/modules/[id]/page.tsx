"use client";

import { use, Suspense, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useUser } from "@/hooks/use-user";
import { AuthModal } from "@/components/auth/auth-modal";
import { useEnrollmentGate } from "@/hooks/use-enrollment";
import { EnrollmentCheckScreen } from "@/components/auth/enrollment-check";

type Lesson = {
  title: string;
  content: string;
  videoUrl?: string;
};

// Mock lesson content for now
const LESSONS: Record<string, Lesson> = {
  // Module 2 is now built out natively
};

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.id;
  const router = useRouter();
  const { markModuleComplete, setActiveLessonIndex, setActiveSlideProgress, projectSpine } = useProgressStore();
  const { user, isLoading: authLoading } = useUser();

  const { isSynced } = useSyncEngine(moduleId);

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

  const { isEnrolled: accessGranted, isLoading: enrollmentLoading } = useEnrollmentGate();
  if (enrollmentLoading || !accessGranted) {
    return <EnrollmentCheckScreen label="Preparing your lesson" />;
  }

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
      router.push(`/modules/${nextModuleNum}`);
    } else {
      router.push(`/certificate`);
    }
  };

  if (moduleId === "1") {
    return (
      <Suspense fallback={<EnrollmentCheckScreen label="Loading lesson..." />}>
        <AuthModal isOpen={!authLoading && !user} />
        {!isSynced ? (
          <EnrollmentCheckScreen label="Syncing progress..." />
        ) : (
          <CanvasViewer 
            slides={MODULE_1_SLIDES} 
            onComplete={handleComplete} 
            moduleId={moduleId}
          />
        )}
      </Suspense>
    );
  }

  if (moduleId === "2") {
    return (
      <Suspense fallback={<EnrollmentCheckScreen label="Loading lesson..." />}>
        <AuthModal isOpen={!authLoading && !user} />
        {!isSynced ? (
          <EnrollmentCheckScreen label="Syncing progress..." />
        ) : (
          <CanvasViewer 
            slides={MODULE_2_SLIDES} 
            onComplete={handleComplete} 
            moduleId={moduleId}
          />
        )}
      </Suspense>
    );
  }

  if (moduleId === "3") {
    return (
      <Suspense fallback={<EnrollmentCheckScreen label="Loading lesson..." />}>
        <AuthModal isOpen={!authLoading && !user} />
        {!isSynced ? (
          <EnrollmentCheckScreen label="Syncing progress..." />
        ) : (
          <CanvasViewer 
            slides={MODULE_3_SLIDES} 
            onComplete={handleComplete} 
            moduleId={moduleId}
          />
        )}
      </Suspense>
    );
  }

  if (moduleId === "4") {
    return (
      <Suspense fallback={<EnrollmentCheckScreen label="Loading lesson..." />}>
        <AuthModal isOpen={!authLoading && !user} />
        {!isSynced ? (
          <EnrollmentCheckScreen label="Syncing progress..." />
        ) : (
          <CanvasViewer 
            slides={MODULE_4_SLIDES} 
            onComplete={handleComplete} 
            moduleId={moduleId}
          />
        )}
      </Suspense>
    );
  }

  if (moduleId === "5") {
    return (
      <Suspense fallback={<EnrollmentCheckScreen label="Loading lesson..." />}>
        <AuthModal isOpen={!authLoading && !user} />
        {!isSynced ? (
          <EnrollmentCheckScreen label="Syncing progress..." />
        ) : (
          <CanvasViewer 
            slides={m5Slides} 
            onComplete={handleComplete} 
            moduleId={moduleId}
          />
        )}
      </Suspense>
    );
  }

  if (moduleId === "6") {
    return (
      <Suspense fallback={<EnrollmentCheckScreen label="Loading lesson..." />}>
        <AuthModal isOpen={!authLoading && !user} />
        {!isSynced ? (
          <EnrollmentCheckScreen label="Syncing progress..." />
        ) : (
          <CanvasViewer 
            slides={MODULE_6_SLIDES} 
            onComplete={handleComplete} 
            moduleId={moduleId}
          />
        )}
      </Suspense>
    );
  }

  // Fallback for unknown modules
  const lesson = LESSONS[moduleId];

  if (!lesson) {
    return (
      <div className="p-8 text-center mt-20">
        <AuthModal isOpen={!authLoading && !user} />
        <h1 className="text-2xl font-bold mb-4">Module {moduleId}</h1>
        <p className="text-muted-foreground">This module is not yet implemented.</p>
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
