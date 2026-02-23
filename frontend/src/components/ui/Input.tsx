import { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => (
  <label className="flex w-full flex-col gap-2 text-sm text-black">
    {label && <span className="font-medium text-black/80">{label}</span>}
    <input
      className={cn(
        'h-11 w-full rounded-[20px] border border-white/20 bg-white/10 px-3.5 text-black outline-none backdrop-blur-xl transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] placeholder:text-black/40 focus:border-cobalt focus:ring-2 focus:ring-cobalt/30',
        error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-300/40',
        className
      )}
      {...props}
    />
    {error && <span className="text-xs text-rose-500">{error}</span>}
  </label>
);
