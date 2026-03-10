import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-btg-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-btg-text-dim">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-btg-navy border border-btg-navy-border rounded-xl text-btg-text",
              "placeholder-btg-text-dim text-sm",
              "focus:outline-none focus:border-btg-gold/50 focus:ring-1 focus:ring-btg-gold/20",
              "transition-colors duration-200",
              icon ? "pl-10 pr-4 py-2.5" : "px-4 py-2.5",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-btg-text-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-btg-navy border border-btg-navy-border rounded-xl text-btg-text",
            "placeholder-btg-text-dim text-sm resize-none",
            "focus:outline-none focus:border-btg-gold/50 focus:ring-1 focus:ring-btg-gold/20",
            "transition-colors duration-200 px-4 py-2.5",
            error && "border-red-500/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-btg-text-muted">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-btg-navy border border-btg-navy-border rounded-xl text-btg-text",
            "text-sm focus:outline-none focus:border-btg-gold/50 focus:ring-1 focus:ring-btg-gold/20",
            "transition-colors duration-200 px-4 py-2.5 appearance-none cursor-pointer",
            error && "border-red-500/50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Input;
