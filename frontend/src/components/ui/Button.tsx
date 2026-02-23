import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

const styles = {
  primary:
    'primary-specular rounded-full bg-primary-500 text-white shadow-[0_0_30px_rgba(63,122,128,0.5)] hover:bg-primary-600 hover:scale-105 active:scale-[0.98]',
  secondary: 'glass-button',
  ghost: 'bg-transparent text-black/60 hover:bg-white/10',
  danger: 'rounded-full bg-rose-600 text-white shadow-soft hover:bg-rose-700 hover:scale-105 active:scale-[0.98]'
};

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => (
  <button
    className={cn(
      'inline-flex h-10 items-center justify-center px-5 text-sm font-medium transition-all duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
      styles[variant],
      className
    )}
    {...props}
  />
);
