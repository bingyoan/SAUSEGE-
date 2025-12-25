import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-sausage-50">
            <div className="text-center p-8 max-w-md">
                <div className="text-6xl mb-4">🌭❓</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-6">
                    The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-sausage-600 hover:bg-sausage-700 text-white font-bold rounded-xl transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
