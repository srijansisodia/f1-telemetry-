import { cn } from "@/lib/utils";

interface LoadingPulseProps {
  className?: string;
  lines?: number;
  height?: number;
}

export default function LoadingPulse({
  className,
  lines = 3,
  height = 16,
}: LoadingPulseProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer rounded-lg"
          style={{
            height,
            width: i === lines - 1 ? "60%" : "100%",
            opacity: 1 - i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
