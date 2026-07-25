import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string | undefined;
  id: string;
  className?: string;
}

export const ErrorMessage = ({
  message,
  id,
  className = "",
}: ErrorMessageProps) => {
  if (!message) return null;
  return (
    <p
      data-slot="error-message"
      id={id}
      className={cn("text-xs text-destructive break-word mt-1", className)}
    >
      {message}
    </p>
  );
};
