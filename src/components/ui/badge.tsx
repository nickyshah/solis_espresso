import * as React from 'react';
import { cn } from '@/lib/cn';

export function Badge({ className='', children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-medium', className)}>{children}</span>;
}
