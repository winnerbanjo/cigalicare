import { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = ({ label, error, className, children, ...props }: SelectProps) => (
  <label className="flex w-full flex-col gap-2 text-sm text-slate-700">
    {label && <span className="font-medium">{label}</span>}
    <select
      className={cn(
        'h-11 w-full rounded-xl border border-borderSoft bg-white px-3.5 text-slate-900 outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
        error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-100',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <span className="text-xs text-rose-600">{error}</span>}
  </label>
);
