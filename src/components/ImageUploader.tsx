import { useState, useCallback } from "react";
import { Upload, FileImage, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { extractTextFromImage } from "@/lib/ocr";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  onTextExtracted: (text: string) => void;
  isAnalyzing: boolean;
}

export function ImageUploader({ onTextExtracted, isAnalyzing }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setIsExtracting(true);
    setOcrProgress(0);
    setExtractedText("");

    try {
      const text = await extractTextFromImage(f, setOcrProgress);
      setExtractedText(text);
    } catch {
      setExtractedText("Error extracting text. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) handleFile(f);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setExtractedText("");
    setOcrProgress(0);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">
                Drop intake form image here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, TIFF — text will be extracted via OCR
              </p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 rounded-md overflow-hidden border border-border shrink-0">
                  <img src={preview!} alt="Uploaded" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium truncate">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={reset}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {isExtracting && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Extracting text... {ocrProgress}%
                      </div>
                      <Progress value={ocrProgress} className="h-1.5" />
                    </div>
                  )}

                  {extractedText && !isExtracting && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Extracted text:</p>
                      <div className="max-h-32 overflow-y-auto rounded bg-muted p-2 text-xs font-mono leading-relaxed">
                        {extractedText}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {extractedText && !isExtracting && (
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => onTextExtracted(extractedText)}
                    disabled={isAnalyzing}
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing Case...
                      </>
                    ) : (
                      "Analyze Case with AI"
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
