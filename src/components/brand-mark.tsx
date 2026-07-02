import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "compact";
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-primary text-primary-foreground",
          size === "compact" ? "size-7 text-sm" : "size-9 text-lg",
        )}
      >
        🎾
      </span>
      <span
        className={cn(
          "font-semibold tracking-tight",
          size === "compact" ? "text-base" : "text-lg",
        )}
      >
        Tennis-Coach
      </span>
    </div>
  );
}
