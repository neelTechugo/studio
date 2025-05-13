'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
      <h2 className="text-2xl font-semibold text-destructive mb-2">Oops! Something went wrong.</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We encountered an issue while loading the customization studio. Please try again.
      </p>
      {error?.message && (
        <p className="text-sm bg-destructive/10 p-2 rounded-md text-destructive-foreground mb-4">
          Error details: {error.message}
        </p>
      )}
      <Button
        onClick={() => reset()}
        variant="destructive"
        size="lg"
      >
        Try Again
      </Button>
      <Button
        onClick={() => window.location.href = '/outfits'}
        variant="outline"
        className="mt-4"
      >
        Back to Outfits
      </Button>
    </div>
  );
}
