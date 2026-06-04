import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      <header className="bg-white shadow-sm border-b border-gray-200 z-50 flex-shrink-0 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-extrabold text-blue-600 tracking-tighter flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21.5c-5.24 0-9.5-4.26-9.5-9.5S6.76 2.5 12 2.5s9.5 4.26 9.5 9.5-4.26 9.5-9.5 9.5z" />
                <path d="M12 5C8.13 5 5 8.13 5 12s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
              Stilo
            </NavLink>
            <nav className="flex gap-6 text-sm font-medium">
              <NavLink 
                to="/blog" 
                className={({ isActive }) => isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900 transition-colors"}
              >
                Blog
              </NavLink>
              {isAuthenticated && (
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900 transition-colors"}
                >
                  Dashboard
                </NavLink>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <NavLink 
                to="/login"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
        <div className="h-full w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
