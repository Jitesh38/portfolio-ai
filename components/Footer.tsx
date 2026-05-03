import Link from "next/link";
import AnimatedIconButton from "./buttons/AnimatedBtn";
import GitHubIcon from "./ui/github-icon";

const Footer = () => (
  <footer className="w-full border-t border-border/60">
    <div className="max-w-screen-xl mx-auto px-6 xl:px-0">
      <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-sm font-semibold tracking-tight">
            Portfolio AI
          </span>
          <span className="text-border mx-2">·</span>
          <span className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1">
          <Link href="https://github.com/Jitesh38/portfolio-ai" target="_blank">
            <AnimatedIconButton icon={<GitHubIcon />} className="rounded-full size-9" />
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
