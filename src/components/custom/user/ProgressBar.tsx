import { cn } from "@/lib/utils";
import type { NutrientProgress } from "@/types";
import type { ComponentProps, ReactNode } from "react";

export type ProgressBarColor = "primary" | "blue" | "orange" | "green";

interface ProgressBarProps extends Omit<ComponentProps<"div">, "children"> {
  progress?: NutrientProgress;
  progressBarColor?: ProgressBarColor;
  children: (progress: ProgressBarValue) => ReactNode;
}

interface ProgressBarValue {
  consumed: number;
  total: number;
  percentage: number;
}

const colors: Record<ProgressBarColor, string> = {
  primary: "bg-main",
  blue: "bg-sky-500",
  orange: "bg-orange-500",
  green: "bg-success",
};

export const ProgressBar = ({
  progress,
  progressBarColor = "primary",
  className,
  children,
  ...props
}: ProgressBarProps) => {
  const consumed = progress?.consumed ?? 0;
  const total = consumed + (progress?.remaining ?? 0);
  const percentage = total > 0 ? Math.min((consumed / total) * 100, 100) : 0;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children({
        consumed,
        total,
        percentage: Math.round(percentage),
      })}
      <div
        data-slot="progress-bar-track"
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(Math.max(consumed, 0), total)}
      >
        <div
          data-slot="progress-bar-indicator"
          className={cn(
            "h-full rounded-full transition-[width]",
            colors[progressBarColor],
            consumed > total ? "!bg-warning" : ""
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
