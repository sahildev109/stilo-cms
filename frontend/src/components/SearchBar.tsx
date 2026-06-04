import React, { useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto mb-10 group">
      {/* Background glow effect on focus */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-focus-within:opacity-10 transition duration-300 blur-sm pointer-events-none"></div>
      
      <div className="relative flex items-center bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shadow-sm group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-50 transition-all duration-200">
        <div className="pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-3 pr-20 py-4 bg-transparent border-0 leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-base"
          placeholder="Search articles..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
          {value && (
            <button
              onClick={() => onChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 border border-slate-200 rounded-md text-[10px] font-medium text-slate-400 bg-slate-50 select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

