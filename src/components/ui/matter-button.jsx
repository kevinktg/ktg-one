'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { Button, buttonVariants } from '@/components/ui/button'

/**
 * MatterButton component with elevated material design effect
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'default' | 'sm' | 'lg' | 'icon'} [props.size] - Button size variant
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.asChild] - Render as child component
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - All standard button HTML attributes
 */
function MatterButton({ 
  children, 
  size, 
  className, 
  asChild = false, 
  ...props 
}) {
  return (
    <div
      className={cn(
        'bg-background relative inline-flex size-fit shrink-0 overflow-hidden rounded-full p-1 shadow-[inset_-0.5px_-0.5px_1px_0_rgba(0,0,0,0.6)] transition-shadow duration-500 has-hover:shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.6)] dark:shadow-[inset_-0.5px_-0.5px_1px_0_rgba(255,255,255,0.6)] dark:has-hover:shadow-[inset_0_-2px_4px_0_rgba(255,255,255,0.6)]',
        className
      )}
    >
      <Button
        asChild={asChild}
        size={size}
        className={cn(
          'relative overflow-hidden rounded-full bg-black text-white duration-500 hover:bg-black',

          //Before
          'before:absolute before:inset-0 before:block before:size-full before:rounded-full before:shadow-[inset_0_2px_4.5px_0px_rgba(255,255,255,0.6)] before:duration-300',

          //Hover
          'hover:shadow-[inset_0_-6px_8px_-1px_rgba(25,175,253,0.6)] dark:hover:shadow-[inset_0_-3px_2px_-1px_rgba(25,175,253,0.6)]',

          size === 'lg' && 'text-base has-[>svg]:px-6'
        )}
        {...props}
      >
        {children}
      </Button>
    </div>
  )
}

export { MatterButton }

