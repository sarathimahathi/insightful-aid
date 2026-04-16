export type SeverityLevel = "Low" | "Moderate" | "Severe" | "Life-threatening";
export type AbusePattern = 
  | "Physical Abuse" 
  | "Financial Abuse" 
  | "Coercive Control" 
  | "Emotional Abuse" 
  | "Sexual Abuse" 
  | "Isolation" 
  | "Digital Abuse" 
  | "Verbal Abuse"
  | "Neglect";

export type EmotionDetected = "Fear" | "Anxiety" | "Panic" | "Anger" | "Sadness" | "Neutral" | "Distress";

export interface CaseAnalysis {
  id: string;
  timestamp: string;
  extractedText: string;
  severityScore: SeverityLevel;
  severityReason: string;
  escalationRisk: number; // 0-100
  escalationTriggers: string[];
  abusePatterns: AbusePattern[];
  patternDetails: Record<string, string>;
  emotionsDetected: EmotionDetected[];
  emotionAnalysis: string;
  caseBrief: string;
  legalSuggestions: LegalSuggestion[];
  timeline: TimelineEvent[];
  repeatOffenderIndicators: string[];
  fakeCaseFlags: string[];
  riskAlertSent: boolean;
}

export interface LegalSuggestion {
  section: string;
  title: string;
  description: string;
  applicability: "High" | "Medium" | "Low";
}

export interface TimelineEvent {
  date: string;
  event: string;
  severity: SeverityLevel;
}

export interface DashboardStats {
  totalCases: number;
  criticalCases: number;
  averageRisk: number;
  topPatterns: { pattern: string; count: number }[];
}
