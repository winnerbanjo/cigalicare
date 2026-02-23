import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export const Table = ({ headers, children, className }: TableProps) => (
  <div className={cn('overflow-x-auto rounded-xl border border-borderSoft bg-white shadow-soft', className)}>
    <table className="min-w-full divide-y divide-slate-100 text-sm">
      <thead className="bg-slate-50/70">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 [&_tr]:transition-colors [&_tr]:hover:bg-slate-50/60">{children}</tbody>
    </table>
  </div>
);
