import { cn } from "@/lib/utils";
import type { MealComposition } from "@/types";
import { Droplet, Leaf, type LucideIcon } from "lucide-react";

export type PfcKey = keyof Pick<
  MealComposition,
  "protein" | "fat" | "carbohydrates"
>;

export const PFC_ITEMS: {
  key: PfcKey;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}[] = [
  {
    key: "protein",
    label: "Білки",
    icon: Droplet,
    iconClassName: "text-red-500",
  },
  {
    key: "fat",
    label: "Жири",
    icon: Droplet,
    iconClassName: "text-warning",
  },
  {
    key: "carbohydrates",
    label: "Вуглеводи",
    icon: Leaf,
    iconClassName: "text-success",
  },
];

interface PFCProps {
  protein: number;
  fat: number;
  carbohydrates: number;
  variant?: "compact" | "detailed";
  className?: string;
}

export const PFC = ({
  protein,
  fat,
  carbohydrates,
  variant = "compact",
  className,
}: PFCProps) => {
  const values = { protein, fat, carbohydrates };
  const isDetailed = variant === "detailed";

  return (
    <ul className={cn("grid grid-cols-3", isDetailed ? "gap-3" : "gap-2", className)}>
      {PFC_ITEMS.map(({ key, label, icon: Icon, iconClassName }) => (
        <li
          key={key}
          className={cn(
            "flex flex-col items-center text-center",
            isDetailed
              ? "gap-1 rounded-lg border border-border px-2 py-3"
              : "gap-0.5"
          )}
        >
          <Icon className={cn("size-4", iconClassName)} aria-hidden="true" />
          <span
            className={cn(
              "text-content-muted",
              isDetailed ? "text-xs" : "text-10"
            )}
          >
            {label}
          </span>
          <span
            className={cn(
              "text-content",
              isDetailed ? "text-sm font-semibold" : "text-xs font-medium"
            )}
          >
            {values[key]} г
          </span>
        </li>
      ))}
    </ul>
  );
};
