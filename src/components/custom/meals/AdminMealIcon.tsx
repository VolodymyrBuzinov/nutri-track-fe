import { cn } from "@/lib/utils";
import { Utensils } from "lucide-react";

interface AdminMealIconProps {
  iconUrl: string;
  name: string;
  className?: string;
  size?: number;
}

export const AdminMealIcon = ({
  iconUrl,
  name,
  className = "",
  size = 36,
}: AdminMealIconProps) => {
  if (!iconUrl) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="rounded-full bg-primary p-2 w-max">
          <Utensils className="size-6 text-primary-foreground" />
        </div>
        <span className="text-sm font-medium">{name}</span>
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-2 w-max", className)}>
      <img
        src={iconUrl}
        width={size}
        height={size}
        alt={`${name} icon`}
        className="rounded-full object-cover min-w-9 h-9"
      />
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};
