import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-4 text-center font-sans bg-white">
      <h1 className="text-9xl font-black text-gray-100 mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Page not found</h2>
      <p className="text-gray-500 max-w-md mb-10 text-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-sm"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
