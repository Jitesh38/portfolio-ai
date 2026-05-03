"use client";

import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/hooks/stores/useResumeStore";
import { Wand2 } from "lucide-react";
import { useState } from "react";

export default function AITaglineBtn() {
  const [loading, setLoading] = useState(false);
  const [taglines, setTaglines] = useState<string[]>([]);
  const resume = useResumeStore((s) => s.resume);
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);

  const generate = async () => {
    if (!resume) return;
    setLoading(true);
    setTaglines([]);
    try {
      const res = await fetch("/api/ai/generate-taglines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = await res.json();
      if (data.taglines?.length) setTaglines(data.taglines);
    } finally {
      setLoading(false);
    }
  };

  const pick = (tagline: string) => {
    updatePersonalInfo({ title: tagline });
    setTaglines([]);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={generate}
        disabled={loading}
        className="h-7 gap-1.5 text-xs text-violet-600 border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-600 dark:text-violet-400"
      >
        <Wand2 className="size-3" />
        {loading ? "Generating..." : "Generate Taglines"}
      </Button>

      {taglines.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-1">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            Click one to use it
          </p>
          {taglines.map((t, i) => (
            <button
              key={i}
              onClick={() => pick(t)}
              className="text-left text-xs px-3 py-2 rounded-md border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/15 hover:border-violet-500/40 text-violet-700 dark:text-violet-300 transition-colors"
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setTaglines([])}
            className="text-[10px] text-muted-foreground hover:text-foreground text-left mt-0.5 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
