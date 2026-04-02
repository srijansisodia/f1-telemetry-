import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: "purple" | "cyan";
  className?: string;
  right?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  accent = "purple",
  className,
  right,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between mb-8", className)}>
      <div>
        <div
          className={cn(
            "h-[2px] w-12 mb-3 rounded-full",
            accent === "purple" ? "bg-neon-purple" : "bg-neon-cyan"
          )}
        />
        <h1 className="font-heading text-2xl font-black text-text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
