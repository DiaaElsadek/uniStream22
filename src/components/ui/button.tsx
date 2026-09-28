import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/95 hover:to-blue-600/95 text-primary-foreground shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/30 font-semibold",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/70 hover:border-border",
        outline:
          "border border-border bg-background/60 text-foreground hover:bg-secondary hover:border-primary/40 shadow-2xs",
        ghost:
          "text-foreground hover:bg-secondary/80 hover:text-foreground",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs shadow-destructive/20 font-semibold",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10.5 rounded-lg px-6 text-sm font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
