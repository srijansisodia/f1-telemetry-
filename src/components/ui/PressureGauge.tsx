"use client";
import { motion } from "framer-motion";

interface PressureGaugeProps {
  value: number;
  max?: number;
  color?: string;
  size?: number;
  label?: string;
}

export default function PressureGauge({
  value,
  max = 100,
  color = "#8B5CF6",
  size = 80,
  label,
}: PressureGaugeProps) {
  const pct = Math.min(1, Math.max(0, value / max));
  const radius = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * radius; // semicircle
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: size, height: size / 2 + 8, overflow: "visible" }}>
        <svg
          width={size}
          height={size / 2 + 8}
          viewBox={`0 0 ${size} ${size / 2 + 8}`}
        >
          {/* Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={size * 0.06}
            strokeLinecap="round"
          />
          {/* Fill */}
          <motion.path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.06}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
          {/* Value text */}
          <text
            x={cx}
            y={cy + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize={size * 0.18}
            fontFamily="var(--font-jetbrains-mono)"
            fontWeight="600"
          >
            {Math.round(value)}
          </text>
        </svg>
      </div>
      {label && (
        <span className="font-heading text-[9px] text-text-muted tracking-widest text-center">
          {label}
        </span>
      )}
    </div>
  );
}
