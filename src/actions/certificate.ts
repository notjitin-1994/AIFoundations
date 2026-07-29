"use server";

import { revalidatePath } from "next/cache";

export interface ModuleScore {
  moduleId: string;
  moduleName: string;
  score: number;
  total: number;
}

export interface CertificateRecord {
  id: string;
  userId: string;
  studentName: string;
  baselineScore: number;
  finalScore: number;
  moduleScores: ModuleScore[];
  isVerified: boolean;
  issuedAt: string;
  projectSpine: string;
}

/**
 * Mock function to simulate fetching a certificate from the database (e.g. Supabase).
 */
export async function getCertificateData(userId: string): Promise<CertificateRecord | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return a mock certificate populated with plausible data
  return {
    id: `cert-${Math.random().toString(36).substring(7)}`,
    userId,
    studentName: "Guest Learner", // Will be replaced by real auth data
    baselineScore: 45,
    finalScore: 92,
    moduleScores: [
      { moduleId: "1", moduleName: "AI Fundamentals", score: 100, total: 100 },
      { moduleId: "2", moduleName: "The LLM Brain", score: 90, total: 100 },
      { moduleId: "3", moduleName: "The Toolbelt", score: 85, total: 100 },
      { moduleId: "4", moduleName: "The Assembly Line", score: 95, total: 100 },
      { moduleId: "6", moduleName: "The Horizon", score: 100, total: 100 },
    ],
    // The certificate is Unverified until a human or LLM-judge approves the capstone in DB
    isVerified: false, 
    issuedAt: new Date().toISOString(),
    projectSpine: "AI Application", // To be updated by real user data
  };
}

/**
 * Mock function to request a capstone review/verification.
 */
export async function requestVerification(certId: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In reality, this would mark a flag in Supabase to queue the project for review
  console.log(`Requested verification for certificate ${certId}`);
  revalidatePath('/certificate');
  return { success: true, message: "Verification requested successfully." };
}
