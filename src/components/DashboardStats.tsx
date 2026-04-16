import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";
import type { CaseAnalysis } from "@/types/case";
import { useMemo } from "react";

export function DashboardStats({ cases }: { cases: CaseAnalysis[] }) {
  const stats = useMemo(() => {
    const total = cases.length;
    const critical = cases.filter(
      (c) => c.severityScore === "Life-threatening" || c.severityScore === "Severe"
    ).length;
    const avgRisk = total > 0 ? Math.round(cases.reduce((s, c) => s + c.escalationRisk, 0) / total) : 0;

    const patternMap: Record<string, number> = {};
    cases.forEach((c) =>
      c.abusePatterns.forEach((p) => {
        patternMap[p] = (patternMap[p] || 0) + 1;
      })
    );
    const topPattern = Object.entries(patternMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return { total, critical, avgRisk, topPattern };
  }, [cases]);

  const items = [
    { label: "Total Cases", value: stats.total, icon: BarChart3, color: "text-primary" },
    { label: "Critical Cases", value: stats.critical, icon: AlertTriangle, color: "text-destructive" },
    { label: "Avg Risk Score", value: `${stats.avgRisk}%`, icon: TrendingUp, color: "text-severity-severe" },
    { label: "Top Pattern", value: stats.topPattern, icon: Shield, color: "text-status-info" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{item.value}</p>
              </div>
              <item.icon className={`h-6 w-6 ${item.color} opacity-60`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
