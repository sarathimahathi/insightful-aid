import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

interface TextInputModeProps {
  onSubmit: (text: string) => void;
  isAnalyzing: boolean;
}

export function TextInputMode({ onSubmit, isAnalyzing }: TextInputModeProps) {
  const [text, setText] = useState("");

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <FileText className="h-4 w-4 text-primary" />
        Paste victim statement or intake form text
      </div>
      <Textarea
        placeholder="Paste anonymized victim statement, intake form data, or case history here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="font-mono text-xs"
      />
      <div className="flex justify-end">
        <Button onClick={() => onSubmit(text)} disabled={!text.trim() || isAnalyzing} className="gap-2">
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Case with AI"
          )}
        </Button>
      </div>
    </Card>
  );
}
