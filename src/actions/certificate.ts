"use server";

import crypto from "crypto";
// import { createClient } from "@/lib/supabase/server";

export interface CertificateRecord {
  id: string; // The cryptographic hash
  userId: string;
  baselineScore: number;
  finalScore: number;
  moduleScores: { moduleId: string; moduleName: string; score: number }[];
  isVerified: boolean;
  issuedAt: string;
  projectSpine: string;
}

export async function requestVerification(certId: string) {
  // In a real application, this would mark the certificate for instructor review
  // or trigger an LLM-based verification of the final capstone project.
  console.log(`Verification requested for ${certId}`);
  
  // Simulated delay for realism
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return { success: true };
}

/**
 * Generates a verifiable cryptographic hash based on the certificate data.
 */
export async function generateCertificateHash(
  userId: string,
  baselineScore: number,
  finalScore: number,
  projectSpine: string
) {
  // We use a salt (in a real app this should be a private environment variable)
  const salt = process.env.CERT_SECRET_SALT || "concept2app-secret-salt-2026";
  
  // Combine all the critical data points that must not be forged
  const dataString = `${userId}:${baselineScore}:${finalScore}:${projectSpine}:${salt}`;
  
  // Generate a SHA-256 hash
  const hash = crypto.createHash("sha256").update(dataString).digest("hex");
  
  // Return a readable short string (first 16 chars)
  return `cert-${hash.substring(0, 16)}`;
}

/**
 * This function handles fetching or creating a certificate for a user.
 * It simulates storing the verified record in Supabase.
 */
export async function getOrCreateCertificate(certData: Omit<CertificateRecord, "id" | "issuedAt">) {
  const hashId = await generateCertificateHash(
    certData.userId, 
    certData.baselineScore, 
    certData.finalScore, 
    certData.projectSpine
  );

  const newRecord: CertificateRecord = {
    ...certData,
    id: hashId,
    issuedAt: new Date().toISOString(),
  };

  return newRecord;
}
