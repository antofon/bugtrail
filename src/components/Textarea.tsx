"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const baseClasses = "block w-full rounded-xl glass-subtle border border-white/20 text-white px-4 py-3 text-sm placeholder-gray-400 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:glass-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 resize-none";
    const errorClasses = error ? "border-red-400/50 focus:border-red-400/50 focus:ring-red-500/30" : "";
    const classes = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={classes}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
