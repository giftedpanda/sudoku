import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a <Dialog> provider");
  }
  return context;
}

// --- Dialog Root ---

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

// --- Dialog Trigger ---

export type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ onClick, ...props }, ref) => {
    const { onOpenChange } = useDialogContext();
    return (
      <button
        ref={ref}
        onClick={(e) => {
          onOpenChange(true);
          onClick?.(e);
        }}
        {...props}
      />
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

// --- Dialog Content ---

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, onClose, ...props }, ref) => {
    const { open, onOpenChange } = useDialogContext();
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Trap focus and handle Escape
    React.useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false);
          onClose?.();
        }
      };

      // Prevent body scroll when dialog open
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = prevOverflow;
      };
    }, [open, onOpenChange, onClose]);

    // Focus first focusable element on open
    React.useEffect(() => {
      if (open && contentRef.current) {
        const focusable = contentRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    }, [open]);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50",
            "motion-safe:animate-in motion-safe:fade-in-0"
          )}
          aria-hidden="true"
          onClick={() => {
            onOpenChange(false);
            onClose?.();
          }}
        />
        {/* Panel */}
        <div
          ref={(node) => {
            (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative z-50 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl",
            "dark:border-slate-700 dark:bg-slate-800",
            "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
DialogContent.displayName = "DialogContent";

// --- Dialog Header ---

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
}

// --- Dialog Title ---

export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "text-lg font-semibold leading-none tracking-tight text-slate-900",
          "dark:text-slate-100",
          className
        )}
        {...props}
      />
    );
  }
);
DialogTitle.displayName = "DialogTitle";

// --- Dialog Description ---

export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

// --- Dialog Footer ---

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

// --- Dialog Close ---

export type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialogContext();
    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-4 top-4 rounded-sm p-1 text-slate-400 opacity-70 transition-opacity",
          "hover:opacity-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
          "dark:text-slate-500 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-slate-900",
          "motion-reduce:transition-none",
          className
        )}
        onClick={(e) => {
          onOpenChange(false);
          onClick?.(e);
        }}
        aria-label="Close"
        {...props}
      >
        <X className="h-4 w-4" />
      </button>
    );
  }
);
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
