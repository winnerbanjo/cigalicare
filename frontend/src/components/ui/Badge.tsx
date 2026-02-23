import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'neutral' | 'info' | 'success' | 'warning';
  className?: string;
}

const styles = {
  neutral: 'bg-slate-100 text-slate-700',
  info: 'bg-primary-50 text-primary-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700'
};

export const Badge = ({ children, variant = 'neutral', className }: BadgeProps) => (
  <span className={cn('inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-medium', styles[variant], className)}>
    {children}
  </span>
);
