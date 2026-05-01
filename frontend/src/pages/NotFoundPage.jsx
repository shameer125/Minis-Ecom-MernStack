import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container-custom py-24 text-center animate-fade-in">
      <h1 className="font-display text-8xl md:text-9xl font-bold text-gray-100">404</h1>
      <h2 className="font-display text-3xl text-dark -mt-6 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/shop" className="btn-outline">Shop Now</Link>
      </div>
    </div>
  );
}
