"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/hooks/stores/useResumeStore";
import { Check, Copy, Download, FileText } from "lucide-react";
import { useState } from "react";

export default function AICoverLetter() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"input" | "result">("input");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const resume = useResumeStore((s) => s.resume);

  const generate = async () => {
    if (!resume || !jobDescription.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, jobTitle, company }),
      });
      const data = await res.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
        setStep("result");
      }
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const name = resume?.personalInfo?.name || "Cover Letter";
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${name} — Cover Letter</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.7;
      color: #1a1a1a;
      padding: 72px;
      max-width: 800px;
      margin: 0 auto;
    }
    p { margin-bottom: 1em; }
    @media print {
      body { padding: 0; }
      @page { margin: 1in; }
    }
  </style>
</head>
<body>
  ${coverLetter
    .split("\n")
    .map((line) => (line.trim() ? `<p>${line}</p>` : "<br/>"))
    .join("\n")}
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.focus();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const reset = () => {
    setStep("input");
    setCoverLetter("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400"
        >
          <FileText className="size-3.5" />
          Cover Letter
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 text-rose-500" />
            AI Cover Letter Generator
          </DialogTitle>
        </DialogHeader>

        {/* ── Input step ── */}
        {step === "input" && (
          <div className="space-y-4 pt-1">
            <p className="text-xs text-muted-foreground">
              Enter the job details and we&apos;ll write a tailored cover letter using your resume.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Job Title</label>
                <Input
                  placeholder="e.g. Frontend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Company</label>
                <Input
                  placeholder="e.g. Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">
                Job Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Paste the full job description here..."
                className="min-h-44 text-sm resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <Button
              className="w-full gap-2"
              onClick={generate}
              disabled={loading || !jobDescription.trim()}
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Writing your cover letter...
                </>
              ) : (
                <>
                  <FileText className="size-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </div>
        )}

        {/* ── Result step ── */}
        {step === "result" && (
          <div className="space-y-4 pt-1">
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                onClick={copy}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                onClick={downloadPDF}
              >
                <Download className="size-3.5" />
                Download PDF
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-xs ml-auto"
                onClick={reset}
              >
                ← Edit Inputs
              </Button>
            </div>

            {/* Letter preview */}
            <div className="rounded-lg border bg-card p-6 font-serif text-sm leading-relaxed whitespace-pre-wrap text-foreground shadow-sm">
              {coverLetter}
            </div>

            {/* Regenerate */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5"
              onClick={generate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="size-3.5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <FileText className="size-3.5" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
