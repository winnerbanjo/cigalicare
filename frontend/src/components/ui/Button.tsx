import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

const styles = {
  primary: 'bg-primary-500 text-white shadow-soft hover:bg-primary-600 hover:-translate-y-px',
  secondary: 'border border-borderSoft bg-white text-slate-700 hover:bg-slate-50 hover:-translate-y-px',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white shadow-soft hover:bg-rose-700 hover:-translate-y-px'
};

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => (
  <button
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
      styles[variant],
      className
    )}
    {...props}
  />
);
