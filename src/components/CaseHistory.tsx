import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CaseAnalysis } from "@/types/case";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface CaseHistoryProps {
  cases: CaseAnalysis[];
  onSelect: (c: CaseAnalysis) => void;
  selectedId?: string;
}

export function CaseHistory({ cases, onSelect, selectedId }: CaseHistoryProps) {
  if (cases.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No cases analyzed yet</p>
          <p className="text-xs mt-1">Upload an intake form to begin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Case History ({cases.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-0.5 px-4 pb-4">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                className={`w-full text-left rounded-lg p-3 transition-colors hover:bg-accent ${
                  selectedId === c.id ? "bg-accent border border-primary/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground font-mono">
                    {format(new Date(c.timestamp), "MMM d, HH:mm")}
                  </span>
                  <SeverityBadge level={c.severityScore} />
                </div>
                <p className="text-xs text-foreground line-clamp-2">
                  {c.extractedText.slice(0, 120)}...
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.abusePatterns.slice(0, 3).map((p) => (
                    <Badge key={p} variant="outline" className="text-[10px] px-1.5 py-0">{p}</Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
