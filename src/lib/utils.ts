import { toast } from "@/components/ui/toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ApiError = {
  response: {
    data: {
      error: {
        message: string;
        code: string;
      };
    };
  };
};

export const handleApiError = (error: ApiError) => {
  const message = error?.response?.data.error?.message;

  if (!message) return;
  toast.add({
    title: "Помилка",
    description: message,
    type: "error",
  });
};

export const noDoubleBlanksFilter = (v: string) => v.replace(/ {2,}/g, " ");

export const slugFilter = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/^-+/, "");
