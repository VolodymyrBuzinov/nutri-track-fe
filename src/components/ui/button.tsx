import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 rounded-md font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-main/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-main text-white hover:bg-main-hover",
        outline: "border border-main text-main hover:bg-main-soft",
        secondary: "border border-border bg-white hover:border-main",
        ghost: "text-main hover:bg-main-soft",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "h-auto text-main underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
