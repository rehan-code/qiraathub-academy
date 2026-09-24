import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepSectionProps {
  step: number;
  title: string;
  description?: string;
  done?: boolean;
  disabled?: boolean;
  /** Rendered at the right of the header (e.g. a filter). */
  aside?: ReactNode;
  children: ReactNode;
}

export function StepSection({ step, title, description, done, disabled, aside, children }: StepSectionProps) {
  return (
    <section
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-opacity duration-200 sm:p-6",
        disabled && "pointer-events-none select-none opacity-50",
      )}
    >
      <header className="mb-5 flex items-start gap-3">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            done ? "bg-theme_primary text-white" : "bg-slate-100 text-slate-600",
          )}
          aria-hidden
        >
          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : step}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-tight text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
