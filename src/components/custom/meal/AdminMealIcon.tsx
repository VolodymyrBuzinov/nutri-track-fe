import { Utensils } from "lucide-react";

interface AdminMealIconProps {
  iconUrl: string;
  name: string;
}

export const AdminMealIcon = ({ iconUrl, name }: AdminMealIconProps) => {
  if (!iconUrl) {
    return (
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary p-2 w-max">
          <Utensils className="size-6 text-primary-foreground" />
        </div>
        <span className="text-sm font-medium">{name}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 w-max">
      <img
        src={iconUrl}
        width={36}
        height={36}
        alt={`${name} icon`}
        className="rounded-full object-cover"
      />
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};
