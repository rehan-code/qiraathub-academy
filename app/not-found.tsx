import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 text-gray-800">
      <div className="text-center p-12 -mt-28 bg-white shadow-lg rounded-lg">
        <h1 className="text-7xl font-bold text-theme_primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 text-lg mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="px-6 py-6 text-base bg-theme_primary text-white rounded-lg hover:bg-theme_primary/90 hover:scale-105 transition-all duration-300">
          <Link href="/" >
            Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
