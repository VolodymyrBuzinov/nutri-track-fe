import globalLoader from "@/assets/global-loader.svg";
import { cn } from "@/lib/utils";
import localLoader from "@/assets/local-loader.svg";

interface GlobalLoaderProps {
  className?: string;
  size?: number;
  type?: "global" | "local";
}
export const Loader = ({
  className = "",
  size = 120,
  type = "global",
}: GlobalLoaderProps) => {
  const loader = type === "global" ? globalLoader : localLoader;
  return (
    <div
      className={cn(
        "flex items-center justify-center z-5 bg-white/50",
        type === "global" && "min-h-screen",
        className
      )}
    >
      <img
        src={loader}
        width={size}
        height={size}
        alt="Loading"
        className={cn(`size-[${size}px]`)}
      />
    </div>
  );
};
