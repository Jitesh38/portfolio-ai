"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/hooks/stores/useResumeStore";
import { BriefcaseIcon } from "lucide-react";
import { useState } from "react";

type MatchResult = {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  gaps: string[];
  recommendation: string;
};

function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 75
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 50
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";
  const ring =
    score >= 75
      ? "border-emerald-500/40"
      : score >= 50
        ? "border-yellow-500/40"
        : "border-red-500/40";

  return (
    <div className={`size-20 rounded-full border-4 ${ring} flex flex-col items-center justify-center`}>
      <span className={`text-2xl font-bold font-mono ${color}`}>{score}</span>
      <span className="text-[10px] text-muted-foreground">/ 100</span>
    </div>
  );
}

export default function AIJobMatch() {
  const [open, setOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const resume = useResumeStore((s) => s.resume);

  const analyze = async () => {
    if (!resume || !jobDescription.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setJobDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs text-blue-600 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-600 dark:text-blue-400"
        >
          <BriefcaseIcon className="size-3.5" />
          Job Match
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <BriefcaseIcon className="size-4 text-blue-500" />
            Job Match Analyzer
          </DialogTitle>
        </DialogHeader>

        {/* Input state */}
        {!result && (
          <div className="space-y-4 pt-1">
            <p className="text-xs text-muted-foreground">
              Paste a job description to see how well your profile matches.
            </p>
            <Textarea
              placeholder="Paste the full job description here..."
              className="min-h-48 text-sm resize-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <Button
              className="w-full gap-2"
              onClick={analyze}
              disabled={loading || !jobDescription.trim()}
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BriefcaseIcon className="size-4" />
                  Analyze Match
                </>
              )}
            </Button>
          </div>
        )}

        {/* Results state */}
        {result && (
          <div className="space-y-5 pt-1">
            {/* Score + recommendation */}
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/20">
              <ScoreCircle score={result.score} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold">Match Score</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {result.recommendation}
                </p>
              </div>
            </div>

            {/* Matching skills */}
            {result.matchingSkills?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Matching Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchingSkills.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing skills */}
            {result.missingSkills?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                  Missing Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Strengths</p>
                {result.strengths.map((s, i) => (
                  <p key={i} className="text-xs flex gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span>
                    {s}
                  </p>
                ))}
              </div>
            )}

            {/* Gaps */}
            {result.gaps?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gaps</p>
                {result.gaps.map((g, i) => (
                  <p key={i} className="text-xs flex gap-2">
                    <span className="text-red-500 shrink-0">✗</span>
                    {g}
                  </p>
                ))}
              </div>
            )}

            <Button variant="outline" size="sm" className="w-full text-xs" onClick={reset}>
              Analyze Another Job
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
