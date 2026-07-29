import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatarUrl?: string;
  name: string;
  className?: string;
  size?: number;
}

export const UserAvatar = ({
  avatarUrl,
  name,
  className = "",
  size = 36,
}: UserAvatarProps) => {
  if (!avatarUrl) {
    return (
      <span
        className={cn(
          "flex min-w-9 min-h-9 items-center justify-center rounded-full bg-main-soft text-sm font-semibold text-main",
          className
        )}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <div>
      <img
        src={avatarUrl}
        alt={`${name} avatar`}
        width={size}
        height={size}
        className={cn("min-w-9 rounded-full object-cover", className)}
      />
    </div>
  );
};
