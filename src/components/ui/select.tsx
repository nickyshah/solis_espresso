'use client';
import * as React from 'react';

export function Select({ value, onValueChange, children }: any) {
  return <div data-value={value}>{React.Children.map(children, (c: any)=> React.cloneElement(c, { value, onValueChange }))}</div>;
}
export function SelectTrigger({ className='', children }: any) {
  return <div className={className}>{children}</div>;
}
export function SelectValue({ placeholder }: any) { return <span>{placeholder}</span>; }
export function SelectContent({ children }: any) { return <div className="mt-2 border rounded-md bg-white shadow">{children}</div>; }
export function SelectItem({ value, children, onValueChange }: any) {
  return <div className="px-3 py-2 hover:bg-cream cursor-pointer" onClick={()=>onValueChange?.(value)}>{children}</div>;
}
