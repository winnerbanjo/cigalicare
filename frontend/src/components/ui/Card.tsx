import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <section className={cn('rounded-xl border border-borderSoft bg-white p-6 shadow-soft', className)}>{children}</section>
);
