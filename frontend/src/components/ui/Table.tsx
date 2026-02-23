import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export const Table = ({ headers, children, className }: TableProps) => (
  <div className={cn('glass-luxury overflow-x-auto overflow-y-visible', className)}>
    <table className="min-w-full divide-y divide-white/10 text-sm">
      <thead className="bg-white/5">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-black/60">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10 [&_tr]:transition-colors [&_tr]:hover:bg-white/5">{children}</tbody>
    </table>
  </div>
);
