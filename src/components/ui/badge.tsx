import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-sm px-2.5 py-0.5",
    "text-xs font-medium transition-colors",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-slate-100 text-slate-700",
          "dark:bg-slate-700 dark:text-slate-300",
        ],
        primary: [
          "bg-indigo-100 text-indigo-700",
          "dark:bg-indigo-900 dark:text-indigo-300",
        ],
        success: [
          "bg-green-100 text-green-700",
          "dark:bg-green-900 dark:text-green-300",
        ],
        warning: [
          "bg-amber-100 text-amber-700",
          "dark:bg-amber-900 dark:text-amber-300",
        ],
        error: [
          "bg-red-100 text-red-700",
          "dark:bg-red-900 dark:text-red-300",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
