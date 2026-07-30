import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";

interface InfoPopoverProps {
  content: string;
  label?: string;
}

export const InfoPopover = ({
  content,
  label = "Додаткова інформація",
}: InfoPopoverProps) => (
  <Popover>
    <PopoverTrigger
      aria-label={label}
      className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full text-content-muted transition-colors hover:text-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <CircleHelp className="size-4" aria-hidden="true" />
    </PopoverTrigger>
    <PopoverContent className="w-56">
      <p>{content}</p>
    </PopoverContent>
  </Popover>
);
