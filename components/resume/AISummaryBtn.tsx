"use client";

import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/hooks/stores/useResumeStore";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function AISummaryBtn() {
  const [loading, setLoading] = useState(false);
  const resume = useResumeStore((s) => s.resume);
  const updateSummary = useResumeStore((s) => s.updateSummary);

  const generate = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = await res.json();
      if (data.summary) updateSummary(data.summary);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={generate}
      disabled={loading}
      className="h-7 gap-1.5 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400"
    >
      <Sparkles className="size-3" />
      {loading ? "Generating..." : "Generate with AI"}
    </Button>
  );
}
