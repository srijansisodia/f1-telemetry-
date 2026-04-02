"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { TEAMMATE_PAIRS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function DriverSelector() {
  const router = useRouter();
  const params = useSearchParams();
  const d1 = params.get("d1") ?? "VER";
  const d2 = params.get("d2") ?? "PER";
  const current = `${d1}-${d2}`;

  return (
    <div className="flex flex-wrap gap-2">
      {TEAMMATE_PAIRS.map(([a, b]) => {
        const key = `${a}-${b}`;
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() =>
              router.replace(`/battle?d1=${a}&d2=${b}`, { scroll: false })
            }
            className={cn(
              "px-3 py-1.5 rounded-lg font-heading text-[10px] tracking-widest transition-all border",
              active
                ? "bg-neon-purple/15 border-neon-purple/40 text-neon-purple"
                : "bg-white/3 border-white/10 text-text-muted hover:border-white/20 hover:text-text-secondary"
            )}
          >
            {a} vs {b}
          </button>
        );
      })}
    </div>
  );
}
