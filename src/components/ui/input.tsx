import * as React from 'react';
import { cn } from '@/lib/cn';
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn('w-full rounded-md border p-3 focus:outline-none', className)} {...props} />
  )
);
Input.displayName = 'Input';
