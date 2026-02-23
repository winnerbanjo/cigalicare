import { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, placeholder, ...props }: InputProps) => (
  <label className="flex w-full flex-col gap-1.5 text-sm text-black">
    <span className="relative block">
      <input
        className={cn(
          'peer h-12 w-full rounded-[20px] border border-white/30 bg-white/70 px-3.5 pb-2.5 pt-5 text-black outline-none backdrop-blur-xl transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] placeholder:text-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-300/40',
          className
        )}
        placeholder={label ? ' ' : placeholder}
        {...props}
      />

      {label ? (
        <span className="pointer-events-none absolute left-3.5 top-2 text-xs text-black/55 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-black/45 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-600">
          {label}
        </span>
      ) : null}
    </span>

    {error && <span className="text-xs text-rose-500">{error}</span>}
  </label>
);
