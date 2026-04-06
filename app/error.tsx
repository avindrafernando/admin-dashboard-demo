'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return <ErrorContainer reset={reset} />;
}

export const ErrorContainer = ({ reset }: { reset?: () => void }) => (
  <main className="p-4 md:p-6">
    <div>
      <h2 className="text-red-600">Something went wrong!</h2>
      {reset && (
        <Button
          className="w-full border-red-600 text-red-600 mt-4"
          size="sm"
          variant="outline"
          onClick={() => reset()}
        >
          Take Me Back
        </Button>
      )}
    </div>
  </main>
);
