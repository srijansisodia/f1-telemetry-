import { cn } from "@/lib/utils";

interface DataLabelProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
}

const SIZE_CLASSES = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
  xl: "text-2xl",
};

export default function DataLabel({
  children,
  className,
  size = "md",
  glow = false,
}: DataLabelProps) {
  return (
    <span
      className={cn(
        "font-data font-medium text-text-data tabular-nums",
        SIZE_CLASSES[size],
        glow && "text-glow-cyan",
        className
      )}
    >
      {children}
    </span>
  );
}
