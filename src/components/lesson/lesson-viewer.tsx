"use client";

import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import { sendXAPIStatement } from "@/actions/xapi";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface LessonViewerProps {
  title: string;
  markdownContent: string;
  videoUrl?: string;
  onVideoComplete?: () => void;
  moduleId?: string;
}

export function LessonViewer({ title, markdownContent, videoUrl, onVideoComplete, moduleId = "unknown" }: LessonViewerProps) {
  const handleVideoStart = async () => {
    if (!videoUrl) return;
    await sendXAPIStatement(
      "http://adlnet.gov/expapi/verbs/launched",
      "started_video",
      `http://smartslate.com/activities/video/${moduleId}`,
      `Video for Module ${moduleId}`,
      `Learner started the video for module ${moduleId}`
    );
  };

  const handleVideoPause = async () => {
    if (!videoUrl) return;
    await sendXAPIStatement(
      "http://id.tincanapi.com/verb/paused",
      "paused_video",
      `http://smartslate.com/activities/video/${moduleId}`,
      `Video for Module ${moduleId}`,
      `Learner paused the video for module ${moduleId}`
    );
  };
  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-primary">{title}</h1>
      </div>

      {videoUrl && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-border shadow-lg aspect-video bg-background">
          <ReactPlayer 
            url={videoUrl} 
            width="100%" 
            height="100%" 
            controls 
            onPlay={handleVideoStart}
            onPause={handleVideoPause}
            onEnded={onVideoComplete}
          />
        </div>
      )}

      <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:text-primary prose-a:text-secondary prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
}
