const steps = [
  {
    title: "Prepare Your Data",
    description:
      "Use your existing resume PDF or export your LinkedIn profile as a PDF from the 'Resources' section on your profile.",
  },
  {
    title: "Upload Document",
    description:
      "Drop your PDF into our secure uploader. Our system immediately begins parsing your experience, skills, and achievements.",
  },
  {
    title: "AI Transformation",
    description:
      "Our AI analyzes your professional history to structure it into a high-conversion, web-optimized format.",
  },
  {
    title: "Custom Generation",
    description:
      "Sit back while we build a custom-made personal website that mirrors a professional resume view with a modern digital touch.",
  },
  {
    title: "Review & Launch",
    description:
      "Finalize your details, choose your theme, and launch your professional portfolio to the world in seconds.",
  },
];

export default function Timeline() {
  return (
    <div className="space-y-0">
      {steps.map(({ title, description }, index) => (
        <div
          key={index}
          className="group flex gap-8 pb-12 last:pb-0"
        >
          {/* Number column */}
          <div className="flex flex-col items-center shrink-0">
            <span className="font-mono text-4xl font-bold text-emerald-600/20 dark:text-emerald-400/20 group-hover:text-emerald-600/60 dark:group-hover:text-emerald-400/60 transition-colors duration-300 leading-none select-none">
              {String(index + 1).padStart(2, "0")}
            </span>
            {index < steps.length - 1 && (
              <div className="mt-3 w-px flex-1 bg-border/60 min-h-[32px]" />
            )}
          </div>

          {/* Content */}
          <div className="pb-2 pt-1">
            <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
