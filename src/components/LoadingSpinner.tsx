'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  variant?: 'primary' | 'white' | 'gray'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const variantClasses = {
  primary: 'border-blue-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-400 border-t-transparent'
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  text,
  variant = 'primary' 
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)} data-testid="loading-spinner">
      <div 
        className={cn(
          'animate-spin rounded-full border-2',
          sizeClasses[size],
          variantClasses[variant]
        )}
        data-testid="spinner"
      />
      {text && (
        <span className={cn(
          'font-medium',
          variant === 'white' ? 'text-white' : variant === 'gray' ? 'text-gray-600' : 'text-blue-600'
        )}>
          {text}
        </span>
      )}
    </div>
  )
}

export function ButtonLoading({ 
  children, 
  loading = false, 
  disabled = false,
  className = '',
  isLoading,
  ...buttonProps 
}: {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
  isLoading?: boolean
  [key: string]: any
}) {
  // Usar loading prop o isLoading prop para compatibilidad
  const isLoadingState = loading || isLoading

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoadingState}
      {...buttonProps}
    >
      {isLoadingState && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" variant="white" />
        </div>
      )}
      <span className={cn(isLoadingState && 'opacity-0')}>
        {children}
      </span>
    </button>
  )
}

export default LoadingSpinner
