import { FileText, Globe, Layers, Zap } from "lucide-react";
import HomeActionBtn from "./buttons/BuildMyWebsiteBtn";
import ShareBtn from "./buttons/ShareBtn";
import Timeline from "./timeline";

const features = [
  { icon: Zap, label: "AI-Powered", desc: "Instant extraction" },
  { icon: Layers, label: "2 Styles", desc: "Simple & Bento" },
  { icon: Globe, label: "One Click", desc: "Publish instantly" },
  { icon: FileText, label: "PDF Import", desc: "LinkedIn or resume" },
];

const Hero = () => (
  <div className="w-full">
    {/* ── Hero ─────────────────────────────────────────── */}
    <section className="relative flex flex-col items-center justify-center min-h-[92vh] px-6 py-28 overflow-hidden">

      {/* Grid background */}
      <div
        className="absolute inset-0 -z-10 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 dark:bg-emerald-400/6 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Label */}
      <div
        className="animate-fade-in font-mono text-[11px] tracking-[0.35em] uppercase text-emerald-600 dark:text-emerald-400 mb-10 flex items-center gap-2"
        style={{ animationDelay: "0ms" }}
      >
        <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Portfolio AI — Resume to Website
      </div>

      {/* Headline */}
      <h1
        className="animate-slide-up text-5xl sm:text-7xl md:text-[88px] font-bold tracking-[-0.03em] text-center leading-[0.92] max-w-4xl text-foreground mb-8"
        style={{ animationDelay: "80ms" }}
      >
        Turn Your Resume
        <br />
        Into a{" "}
        <span className="text-emerald-600 dark:text-emerald-400">
          Stunning
        </span>
        <br />
        Website.
      </h1>

      {/* Subtext */}
      <p
        className="animate-slide-up text-base md:text-lg text-muted-foreground text-center max-w-lg mb-12 leading-relaxed"
        style={{ animationDelay: "160ms" }}
      >
        Stop wrestling with website builders. Drop your LinkedIn PDF or resume
        — we generate a professional personal site in seconds. No coding
        required.
      </p>

      {/* CTA Buttons */}
      <div
        className="animate-slide-up flex flex-col sm:flex-row items-center gap-4 mb-20"
        style={{ animationDelay: "240ms" }}
      >
        <HomeActionBtn />
        <ShareBtn />
      </div>

      {/* Feature strip */}
      <div
        className="animate-slide-up w-full max-w-2xl border-t border-border/60 pt-8"
        style={{ animationDelay: "320ms" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="size-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">{label}</div>
                <div className="text-[11px] text-muted-foreground font-mono tracking-wide">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── How it works ─────────────────────────────────── */}
    <section className="border-t border-border/50 px-6 py-24">
      <div className="max-w-screen-sm mx-auto">
        <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-emerald-600 dark:text-emerald-400 mb-3">
          ◈ How it works
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16">
          Five steps to launch.
        </h2>
        <Timeline />
      </div>
    </section>
  </div>
);

export default Hero;
