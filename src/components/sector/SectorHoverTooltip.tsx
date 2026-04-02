"use client";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

export default function SectorHoverTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="px-3 py-2 rounded-lg border text-xs"
      style={{
        background: "rgba(15, 15, 26, 0.95)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.12)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <p className="font-heading text-[9px] text-text-muted tracking-widest mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="font-data text-text-secondary">{entry.name}:</span>
          <span className="font-data" style={{ color: entry.color }}>
            {(entry.value / 1000).toFixed(3)}s
          </span>
        </div>
      ))}
    </div>
  );
}
