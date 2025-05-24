import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
