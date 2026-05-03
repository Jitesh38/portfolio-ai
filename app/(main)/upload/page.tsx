import InfoDialog from "@/components/buttons/InfoBtn";
import FileUpload from "@/components/FileUpload";

export default function Upload() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Grid background */}
      <div
        className="absolute inset-0 -z-10 opacity-30 dark:opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/8 dark:bg-emerald-400/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up" style={{ animationDelay: "0ms" }}>
        {/* Label */}
        <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
          Upload Resume
        </p>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Drop your PDF.
        </h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Upload your resume or LinkedIn export and we&apos;ll generate your
          personal site instantly.
        </p>

        {/* Upload area */}
        <div className="rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm p-6 shadow-sm">
          <FileUpload />
        </div>

        {/* LinkedIn hint */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Using LinkedIn?
          </span>
          <InfoDialog gifUrl="/linkedin.gif" />
        </div>
      </div>
    </div>
  );
}
