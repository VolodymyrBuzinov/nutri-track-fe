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

export const noDoubleBlanksFilter = (v: string) => v.replace(/ {2,}/g, " ");

export const onlyDigitsFilter = (v: string) => v.replace(/[^0-9]/g, "");

export const slugFilter = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/^-+/, "");
