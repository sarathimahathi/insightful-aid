import type { SeverityLevel } from "@/types/case";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const severityConfig: Record<SeverityLevel, { class: string; dot: string }> = {
  Low: { class: "severity-low", dot: "bg-emerald-500" },
  Moderate: { class: "severity-moderate", dot: "bg-amber-500" },
  Severe: { class: "severity-severe", dot: "bg-orange-500" },
  "Life-threatening": { class: "severity-critical", dot: "bg-red-500 animate-pulse-slow" },
};

export function SeverityBadge({ level }: { level: SeverityLevel }) {
  const config = severityConfig[level];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", config.class)}>
      <span className={cn("h-2 w-2 rounded-full", config.dot)} />
      {level}
    </Badge>
  );
}
