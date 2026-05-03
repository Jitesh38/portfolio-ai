"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useResumeStore } from "@/hooks/stores/useResumeStore";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

type Issue = {
  type: string;
  description: string;
  severity: "high" | "medium" | "low";
};

type ATSResult = {
  score: number;
  issues: Issue[];
  suggestions: string[];
  verdict: string;
};

const severityConfig = {
  high: "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400",
  medium: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400",
  low: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
};

function ScoreMeter({ score }: { score: number }) {
  const color =
    score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
  const label =
    score >= 75 ? "ATS Friendly" : score >= 50 ? "Needs Work" : "High Risk";
  const labelColor =
    score >= 75
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 50
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">ATS Score</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold">{score}/100</span>
          <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function AIATSCheck() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const rawText = useResumeStore((s) => s.rawText);
  const resume = useResumeStore((s) => s.resume);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, resume }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !result) analyze();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs text-orange-600 border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-600 dark:text-orange-400"
        >
          <ShieldCheck className="size-3.5" />
          ATS Check
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-orange-500" />
            ATS Compatibility Check
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center py-12 gap-3 text-muted-foreground">
            <div className="size-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-sm">Checking ATS compatibility...</p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-5 pt-1">
            {/* Score meter */}
            <div className="p-4 rounded-lg border bg-muted/20">
              <ScoreMeter score={result.score} />
              {result.verdict && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {result.verdict}
                </p>
              )}
            </div>

            {/* Issues */}
            {result.issues?.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Issues Found
                </p>
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/10">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 mt-0.5 ${severityConfig[issue.severity] || severityConfig.low}`}
                    >
                      {issue.severity}
                    </span>
                    <div>
                      <p className="text-xs font-medium">{issue.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  How to Fix
                </p>
                {result.suggestions.map((s, i) => (
                  <p key={i} className="text-xs flex gap-2">
                    <span className="text-orange-500 shrink-0 mt-0.5">→</span>
                    {s}
                  </p>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5"
              onClick={analyze}
            >
              <ShieldCheck className="size-3" />
              Re-check
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
