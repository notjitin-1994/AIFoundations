"use client";
import { useCallback } from "react";
import { sendXAPIStatement } from "@/actions/xapi";

export function useLRS() {
  const track = useCallback(async (
    verb: string, verbDisplay: string, objectId: string, objectName: string,
    objectDescription?: string,
    context?: { moduleId?: string; slideId?: string; lessonIndex?: number; result?: { score?: number; success?: boolean; completion?: boolean } }
  ) => {
    try { await sendXAPIStatement(verb, verbDisplay, objectId, objectName, objectDescription, context); }
    catch (e) { console.error("LRS tracking error:", e); }
  }, []);
  return { track };
}
