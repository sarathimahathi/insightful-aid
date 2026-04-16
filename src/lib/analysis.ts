import { supabase } from "@/integrations/supabase/client";
import type { CaseAnalysis } from "@/types/case";

export async function analyzeCase(extractedText: string): Promise<CaseAnalysis> {
  const { data, error } = await supabase.functions.invoke("analyze-case", {
    body: { text: extractedText },
  });

  if (error) throw new Error(error.message || "Analysis failed");
  if (!data) throw new Error("No analysis data returned");

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    extractedText,
    ...data,
  };
}
