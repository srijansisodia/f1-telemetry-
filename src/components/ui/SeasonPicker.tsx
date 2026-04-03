"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { AVAILABLE_SEASONS, CURRENT_SEASON } from "@/lib/constants";

export default function SeasonPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = Number(searchParams.get("season") ?? CURRENT_SEASON);

  return (
    <div className="flex gap-2">
      {AVAILABLE_SEASONS.map((s) => (
        <button
          key={s}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("season", String(s));
            router.push(`?${params.toString()}`);
          }}
          className={`font-heading text-xs px-3 py-1.5 rounded border transition-colors ${
            s === current
              ? "border-purple-500 bg-purple-500/20 text-purple-300"
              : "border-white/10 text-text-muted hover:border-white/20"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
