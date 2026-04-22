'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-4">{error.message || 'Algo salió mal. Por favor intenta de nuevo.'}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
