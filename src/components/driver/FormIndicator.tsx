import { cn } from "@/lib/utils";
import type { FormTrend } from "@/types";

interface FormIndicatorProps {
  trend: FormTrend;
  className?: string;
}

const TREND_CONFIG = {
  up: { icon: "▲", color: "#10B981", label: "Form ↑" },
  down: { icon: "▼", color: "#EF4444", label: "Form ↓" },
  stable: { icon: "■", color: "#94A3B8", label: "Stable" },
};

export default function FormIndicator({ trend, className }: FormIndicatorProps) {
  const config = TREND_CONFIG[trend];
  return (
    <span
      className={cn("font-heading text-[10px] tracking-widest inline-flex items-center gap-1", className)}
      style={{ color: config.color }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
