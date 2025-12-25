'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-sausage-50">
            <div className="text-center p-8 max-w-md">
                <div className="text-6xl mb-4">🌭💔</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
                <p className="text-gray-600 mb-6">
                    We couldn&apos;t load this page. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-sausage-600 hover:bg-sausage-700 text-white font-bold rounded-xl transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
