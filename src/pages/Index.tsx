import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Image, Type, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/ImageUploader";
import { TextInputMode } from "@/components/TextInputMode";
import { CaseAnalysisView } from "@/components/CaseAnalysisView";
import { CaseHistory } from "@/components/CaseHistory";
import { DashboardStats } from "@/components/DashboardStats";
import { PatternChart } from "@/components/PatternChart";
import { analyzeCase } from "@/lib/analysis";
import { useToast } from "@/hooks/use-toast";
import type { CaseAnalysis } from "@/types/case";

export default function Index() {
  const [cases, setCases] = useState<CaseAnalysis[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCase(text);
      setCases((prev) => [result, ...prev]);
      setSelectedCase(result);
      toast({
        title: "Analysis Complete",
        description: `Severity: ${result.severityScore} | Risk: ${result.escalationRisk}%`,
      });
    } catch (err: any) {
      toast({
        title: "Analysis Failed",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              DV Case Pattern Analyzer
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-assisted domestic violence case analysis for legal aid
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <DashboardStats cases={cases} />

        {/* Privacy notice */}
        <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
          <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Privacy-preserving analysis.</strong>{" "}
            All data is processed in-session and never stored. Use only anonymized intake forms.
            This tool assists — it does not replace — professional legal judgment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input + Chart */}
          <div className="lg:col-span-4 space-y-4">
            <Tabs defaultValue="image">
              <TabsList className="w-full">
                <TabsTrigger value="image" className="flex-1 gap-1.5 text-xs">
                  <Image className="h-3.5 w-3.5" /> Image OCR
                </TabsTrigger>
                <TabsTrigger value="text" className="flex-1 gap-1.5 text-xs">
                  <Type className="h-3.5 w-3.5" /> Text Input
                </TabsTrigger>
              </TabsList>
              <TabsContent value="image" className="mt-3">
                <ImageUploader onTextExtracted={handleAnalyze} isAnalyzing={isAnalyzing} />
              </TabsContent>
              <TabsContent value="text" className="mt-3">
                <TextInputMode onSubmit={handleAnalyze} isAnalyzing={isAnalyzing} />
              </TabsContent>
            </Tabs>

            <PatternChart cases={cases} />
            <CaseHistory cases={cases} onSelect={setSelectedCase} selectedId={selectedCase?.id} />
          </div>

          {/* Right: Analysis */}
          <div className="lg:col-span-8">
            {selectedCase ? (
              <motion.div
                key={selectedCase.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CaseAnalysisView analysis={selectedCase} />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-96 rounded-xl border-2 border-dashed border-border">
                <div className="text-center text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No case selected</p>
                  <p className="text-xs mt-1">Upload an intake form image or paste text to begin analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
