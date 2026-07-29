import { toast } from "@/components/ui/toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ApiError = {
  data: {
    message: string;
    code: string;
  };
};
export const handleApiError = (error: ApiError) => {
  toast.add({
    title: "Помилка",
    description: error.data.message,
    type: "error",
  });
};
