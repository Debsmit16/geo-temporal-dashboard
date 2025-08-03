'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    try {
      // Handle unhandled promise rejections from extensions
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        try {
          const reason = event.reason;
          if (reason && typeof reason === 'object' && reason.message) {
            const message = String(reason.message);
            if (
              message.includes('message channel closed') ||
              message.includes('runtime.lastError') ||
              message.includes('Extension context invalidated')
            ) {
              event.preventDefault(); // Prevent the error from being logged
              return;
            }
          }
        } catch (e) {
          // Ignore errors in error handling
        }
      };

      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      // Cleanup
      return () => {
        try {
          window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        } catch (e) {
          // Ignore cleanup errors
        }
      };
    } catch (e) {
      // If anything fails, just return without error handling
      console.warn('Error boundary setup failed:', e);
    }
  }, []);

  return <>{children}</>;
}
