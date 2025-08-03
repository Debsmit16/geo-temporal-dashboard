'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress browser extension errors that don't affect the app
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = function(...args) {
      const message = args[0];
      if (typeof message === 'string') {
        // Suppress common extension-related errors
        if (
          message.includes('message channel closed') ||
          message.includes('runtime.lastError') ||
          message.includes('Extension context invalidated') ||
          message.includes('Could not establish connection')
        ) {
          return; // Don't log these errors
        }
      }
      originalError.apply(console, args);
    };

    console.warn = function(...args) {
      const message = args[0];
      if (typeof message === 'string') {
        // Suppress extension-related warnings
        if (
          message.includes('runtime.lastError') ||
          message.includes('Extension')
        ) {
          return; // Don't log these warnings
        }
      }
      originalWarn.apply(console, args);
    };

    // Handle unhandled promise rejections from extensions
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason && typeof reason.message === 'string') {
        if (
          reason.message.includes('message channel closed') ||
          reason.message.includes('runtime.lastError') ||
          reason.message.includes('Extension context invalidated')
        ) {
          event.preventDefault(); // Prevent the error from being logged
          return;
        }
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}
