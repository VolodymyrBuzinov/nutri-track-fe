import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type InputGroupAddonProps = ComponentProps<"div"> & {
  align?: "inline-start" | "inline-end";
};

function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "flex h-10 items-center rounded-md border border-input bg-white focus-within:border-main focus-within:ring-2 focus-within:ring-main/20 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

function InputGroupAddon({
  align = "inline-start",
  className,
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "flex items-center text-content-muted",
        align === "inline-start" ? "order-first pl-3" : "order-last pr-1",
        className
      )}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest("button")) {
          event.currentTarget.parentElement?.querySelector("input")?.focus();
        }
      }}
      {...props}
    />
  );
}

function InputGroupButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="input-group-button"
      type="button"
      variant="ghost"
      size="icon"
      className={cn("size-9 shrink-0 text-content-muted", className)}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "min-w-0 flex-1 border-0 bg-transparent focus-visible:ring-0 aria-invalid:ring-0",
        className
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput };
