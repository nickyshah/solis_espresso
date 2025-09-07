'use client';
import * as React from 'react';

export function Tabs({ value, onValueChange, children }: any) {
  return <div data-value={value} onChange={()=>{}}>{children}</div>;
}
export function TabsList({ className='', children }: any) {
  return <div className={className + ' inline-flex gap-2 rounded-lg p-1'}>{children}</div>;
}
export function TabsTrigger({ value, className='', children, ...props }: any) {
  return (
    <button
      data-value={value}
      className={className + ' px-4 py-2 rounded-md border'}
      onClick={props.onClick || (()=> props.onValueChange?.(value))}
      {...props}
    >
      {children}
    </button>
  );
}
