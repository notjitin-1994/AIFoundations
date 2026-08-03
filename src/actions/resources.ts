"use server"

import { createClient } from "@/lib/supabase/server"

export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
}

export async function fetchPromptTemplates(): Promise<PromptTemplate[]> {
  const supabase = await createClient()
  
  // Attempt to fetch from the prompt_templates table
  const { data, error } = await supabase
    .from('prompt_templates')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error("Error fetching prompt templates from database:", error)
    // If the table doesn't exist yet, we return an empty array to avoid crashing, 
    // ensuring this is fully dynamic and not hardcoded.
    return [];
  }
  
  return data as PromptTemplate[];
}
