import { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = ({ label, error, className, children, ...props }: SelectProps) => (
  <label className="flex w-full flex-col gap-1.5 text-sm text-black">
    <span className="relative block">
      {label ? <span className="absolute left-3.5 top-2 z-10 text-xs text-black/55">{label}</span> : null}
      <select
        className={cn(
          'h-12 w-full rounded-[20px] border border-white/30 bg-white/70 px-3.5 pb-2 pt-5 text-black outline-none backdrop-blur-xl transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-300/40',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </span>

    {error && <span className="text-xs text-rose-500">{error}</span>}
  </label>
);
