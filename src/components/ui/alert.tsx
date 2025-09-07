import * as React from 'react';
import { cn } from '@/lib/cn';
export function Alert({ className='', children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-md border p-3', className)}>{children}</div>;
}
export function AlertDescription({ className='', children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('text-sm', className)}>{children}</div>;
}
