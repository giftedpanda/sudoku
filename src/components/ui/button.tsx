import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
    "dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-slate-900",
    "disabled:pointer-events-none disabled:opacity-50",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "border border-slate-200 bg-white text-slate-900 shadow-sm",
          "hover:bg-slate-50",
          "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
          "dark:hover:bg-slate-700",
        ],
        primary: [
          "bg-indigo-600 text-white shadow-sm",
          "hover:bg-indigo-700",
          "dark:bg-indigo-500 dark:hover:bg-indigo-600",
        ],
        secondary: [
          "bg-slate-100 text-slate-700 shadow-sm",
          "hover:bg-slate-200",
          "dark:bg-slate-700 dark:text-slate-200",
          "dark:hover:bg-slate-600",
        ],
        ghost: [
          "text-slate-700",
          "hover:bg-slate-100",
          "dark:text-slate-300 dark:hover:bg-slate-800",
        ],
        destructive: [
          "bg-red-600 text-white shadow-sm",
          "hover:bg-red-700",
          "dark:bg-red-500 dark:hover:bg-red-600",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
