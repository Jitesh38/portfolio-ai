"use client";

import { getShareUrl } from "@/lib/supabase/user/getShareUrl";
import { Check, Loader2, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { toastManager } from "../ui/toast";

export default function ShareBtn() {
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const handleShare = async () => {
    setLoading(true);
    try {
      // Fetch the specific URL from the server action
      const shareUrl = await getShareUrl();

      if (!shareUrl) {
        router.push("/upload");
        return;
      }

      const shareData = {
        title: "Wrkks - Resume to Website",
        text: "Check out my professional site built with Wrkks!",
        url: shareUrl,
      };

      // 1. Native Share
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 2. Clipboard Fallback
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        toastManager.add({ title: "Link copied!", type: "success" });
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      toastManager.add({ title: "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={loading}
      variant="outline"
      size="lg"
      className="rounded-full w-full md:w-auto px-8 h-14 bg-white/5 backdrop-blur-md border-slate-200 dark:border-white/10 text-base font-medium shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-white/10 group disabled:opacity-70"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isCopied ? (
        <Check className="mr-2 h-4 w-4 text-green-500 animate-in zoom-in" />
      ) : (
        <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
      )}
      <span>
        {loading ? "Generating..." : isCopied ? "Copied!" : "Share My Wrkk"}
      </span>
    </Button>
  );
}
