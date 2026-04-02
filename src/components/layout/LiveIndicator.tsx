"use client";

export default function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-2 h-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
      </div>
      <span className="font-heading text-xs text-text-muted tracking-widest">
        2024
      </span>
    </div>
  );
}
