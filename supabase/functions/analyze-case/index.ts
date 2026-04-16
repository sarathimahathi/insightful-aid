import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert legal analyst specializing in domestic violence cases under Indian law (IPC/BNS). You analyze anonymized victim statements and intake forms to help legal aid lawyers.

Given the extracted text from a case intake form or victim statement, you MUST return a VALID JSON object with these exact fields:

{
  "severityScore": "Low" | "Moderate" | "Severe" | "Life-threatening",
  "severityReason": "Brief explanation of severity assessment",
  "escalationRisk": <number 0-100>,
  "escalationTriggers": ["trigger1", "trigger2", ...],
  "abusePatterns": ["Physical Abuse" | "Financial Abuse" | "Coercive Control" | "Emotional Abuse" | "Sexual Abuse" | "Isolation" | "Digital Abuse" | "Verbal Abuse" | "Neglect"],
  "patternDetails": { "Pattern Name": "Evidence from text" },
  "emotionsDetected": ["Fear" | "Anxiety" | "Panic" | "Anger" | "Sadness" | "Neutral" | "Distress"],
  "emotionAnalysis": "Brief emotion analysis",
  "caseBrief": "Structured markdown case brief for lawyer with sections: Background, Key Incidents, Risk Assessment, Recommended Actions",
  "legalSuggestions": [
    { "section": "IPC/BNS Section", "title": "Short title", "description": "How it applies", "applicability": "High" | "Medium" | "Low" }
  ],
  "timeline": [
    { "date": "Date or timeframe", "event": "What happened", "severity": "Low" | "Moderate" | "Severe" | "Life-threatening" }
  ],
  "repeatOffenderIndicators": ["indicator1", ...],
  "fakeCaseFlags": ["inconsistency1", ...],
  "riskAlertSent": false
}

Rules:
- Always return ONLY the JSON object, no surrounding text
- Analyze thoroughly for ALL abuse patterns present
- Be specific in escalation triggers
- Legal suggestions must reference actual IPC/BNS sections for domestic violence
- Timeline should reconstruct events chronologically from the text
- Flag any inconsistencies for fake case detection
- Set riskAlertSent to true only if severity is Life-threatening
- Do not duplicate values in any arrays`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Text must be at least 10 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze this domestic violence case intake form / victim statement and return the structured JSON analysis:\n\n${text.slice(0, 8000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI analysis failed");
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Strip markdown code fences if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const analysis = JSON.parse(content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-case error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
