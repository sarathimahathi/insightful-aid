import { motion } from "framer-motion";
import {
  AlertTriangle, Shield, Brain, Scale, Clock, UserX, Eye,
  TrendingUp, FileText, Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge } from "@/components/SeverityBadge";
import type { CaseAnalysis } from "@/types/case";
import ReactMarkdown from "react-markdown";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function CaseAnalysisView({ analysis }: { analysis: CaseAnalysis }) {
  const riskColor =
    analysis.escalationRisk > 75 ? "text-destructive" :
    analysis.escalationRisk > 50 ? "text-severity-severe" :
    analysis.escalationRisk > 25 ? "text-severity-moderate" :
    "text-status-safe";

  return (
    <div className="space-y-4">
      {/* Top summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div {...fadeUp} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Severity</p>
                  <div className="mt-2">
                    <SeverityBadge level={analysis.severityScore} />
                  </div>
                </div>
                <Shield className="h-8 w-8 text-primary/30" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">{analysis.severityReason}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Escalation Risk</p>
                  <p className={`text-3xl font-bold mt-1 ${riskColor}`}>{analysis.escalationRisk}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary/30" />
              </div>
              <Progress
                value={analysis.escalationRisk}
                className="mt-3 h-2"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Emotions Detected</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {analysis.emotionsDetected.map((e) => (
                      <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </div>
                <Heart className="h-8 w-8 text-primary/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Abuse patterns */}
      <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              Behavior Pattern Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.abusePatterns.map((pattern) => (
                <div key={pattern} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium text-foreground">{pattern}</p>
                  {analysis.patternDetails[pattern] && (
                    <p className="text-xs text-muted-foreground mt-1">{analysis.patternDetails[pattern]}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Escalation triggers */}
      <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-severity-severe" />
              Escalation Triggers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.escalationTriggers.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-severity-severe shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two column: Legal + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                Legal Suggestions (IPC/BNS)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.legalSuggestions.map((s, i) => (
                  <div key={i} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-primary">{s.section}</span>
                      <Badge variant={s.applicability === "High" ? "default" : "secondary"} className="text-xs">
                        {s.applicability}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.45 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Incident Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-4 border-l-2 border-border space-y-4">
                {analysis.timeline.map((evt, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <p className="text-xs text-muted-foreground">{evt.date}</p>
                    <p className="text-sm mt-0.5">{evt.event}</p>
                    <SeverityBadge level={evt.severity} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Repeat offender + Fake case */}
      {(analysis.repeatOffenderIndicators.length > 0 || analysis.fakeCaseFlags.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {analysis.repeatOffenderIndicators.length > 0 && (
            <motion.div {...fadeUp} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <UserX className="h-4 w-4 text-destructive" />
                    Repeat Offender Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {analysis.repeatOffenderIndicators.map((r, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {analysis.fakeCaseFlags.length > 0 && (
            <motion.div {...fadeUp} transition={{ delay: 0.55 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4 text-severity-moderate" />
                    Inconsistency Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {analysis.fakeCaseFlags.map((f, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-severity-moderate shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Case brief */}
      <motion.div {...fadeUp} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Structured Case Brief for Lawyer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
              <ReactMarkdown>{analysis.caseBrief}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
