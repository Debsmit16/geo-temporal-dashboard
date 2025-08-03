import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
    </div>
  );
}

interface LoadingPulseProps {
  className?: string;
}

export function LoadingPulse({ className }: LoadingPulseProps) {
  return (
    <div className={cn('flex space-x-2', className)}>
      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({ title = 'Loading...', description, className }: LoadingCardProps) {
  return (
    <div className={cn('glass rounded-xl p-6 border border-white/20 animate-pulse', className)}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700',
        className
      )}
    />
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isVisible, message = 'Loading...', className }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'absolute inset-0 glass backdrop-blur-sm flex items-center justify-center z-50 rounded-xl',
      className
    )}>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
          <LoadingSpinner size="lg" className="border-white border-t-transparent" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {message}
        </h3>
        <LoadingDots />
      </div>
    </div>
  );
}
