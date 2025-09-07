'use client';
import * as React from 'react';
import { cn } from '../../lib/cn';

type Variant = 'default' | 'outline' | 'ghost';
type Size = 'default' | 'sm' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';

const variantClass: Record<Variant, string> = {
  default: 'bg-solis-gold text-navy hover:opacity-90',
  outline: 'border border-current bg-transparent',
  ghost: 'bg-transparent',
};

const sizeClass: Record<Size, string> = {
  default: 'h-10 px-4',
  sm: 'h-9 px-3',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantClass[variant], sizeClass[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
