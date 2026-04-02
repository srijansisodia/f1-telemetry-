import { cn } from "@/lib/utils";

interface NeonBadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function NeonBadge({
  children,
  color = "#8B5CF6",
  className,
  size = "md",
}: NeonBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-heading font-bold tracking-widest",
        size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-[10px]",
        className
      )}
      style={{
        backgroundColor: `${color}18`,
        border: `1px solid ${color}44`,
        color,
        boxShadow: `0 0 8px ${color}22`,
      }}
    >
      {children}
    </span>
  );
}
