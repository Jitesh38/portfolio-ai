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
import { Sparkles } from "lucide-react";
import { useState } from "react";

type Tip = {
  section: string;
  score: number;
  issue: string;
  suggestions: string[];
};

type EnhanceResult = {
  overallScore: number;
  tips: Tip[];
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400"
      : score >= 5
        ? "text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400"
        : "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400";

  return (
    <span
      className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${color}`}
    >
      {score}/10
    </span>
  );
}

export default function AIEnhanceTips() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnhanceResult | null>(null);
  const [open, setOpen] = useState(false);
  const resume = useResumeStore((s) => s.resume);

  const analyze = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
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
          className="gap-1.5 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400"
        >
          <Sparkles className="size-3.5" />
          AI Tips
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-emerald-500" />
            Resume Enhancement Tips
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center py-12 gap-3 text-muted-foreground">
            <div className="size-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-sm">Analyzing your resume...</p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-4 pt-1">
            {/* Overall score */}
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border bg-muted/30">
              <span className="text-sm font-semibold">Overall Score</span>
              <ScoreBadge score={result.overallScore} />
            </div>

            {/* Per-section tips */}
            {result.tips?.map((tip, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{tip.section}</span>
                  <ScoreBadge score={tip.score} />
                </div>
                {tip.issue && (
                  <p className="text-xs text-muted-foreground">{tip.issue}</p>
                )}
                <ul className="space-y-1.5">
                  {tip.suggestions?.map((s, j) => (
                    <li key={j} className="text-xs flex gap-2">
                      <span className="text-emerald-500 mt-0.5 shrink-0">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5"
              onClick={analyze}
            >
              <Sparkles className="size-3" />
              Re-analyze
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
