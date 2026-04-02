"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import LiveIndicator from "./LiveIndicator";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16">
      <div
        className="h-full border-b"
        style={{
          background: "rgba(10, 10, 15, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/standings" className="flex items-center gap-2 group">
            <span
              className="font-heading text-xl font-black gradient-text-purple-cyan"
              style={{ letterSpacing: "0.12em" }}
            >
              F1
            </span>
            <span
              className="font-heading text-sm text-text-secondary group-hover:text-text-primary transition-colors"
              style={{ letterSpacing: "0.2em" }}
            >
              DNA
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg font-heading text-xs transition-all duration-200",
                    active
                      ? "text-neon-purple bg-neon-purple/10 border border-neon-purple/20 text-glow-purple"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Live indicator */}
          <LiveIndicator />
        </div>
      </div>
    </nav>
  );
}
