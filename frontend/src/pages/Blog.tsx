import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import PostCard, { SearchResult } from '../components/PostCard';
import { useSearch } from '../hooks/useSearch';
import { useDebounce } from '../hooks/useDebounce';
import { usePostList } from '../hooks/usePosts';

export default function Blog() {
  const [query, setQuery] = useState('');
  const debouncedQ = useDebounce(query, 300);

  const { data: searchData, isLoading: isSearchLoading } = useSearch(debouncedQ);
  const { data: allPostsData, isLoading: isAllPostsLoading } = usePostList();

  const isSearching = Boolean(debouncedQ.trim());

  const results = isSearching
    ? (searchData?.results as unknown as SearchResult[] || [])
    : Array.isArray(allPostsData)
      ? allPostsData
      : (allPostsData?.posts as unknown as SearchResult[] || []);

  const isLoading = isSearching ? isSearchLoading : isAllPostsLoading;
  console.log(results)
  return (
    <main className="max-w-4xl mx-auto px-6 pt-12 pb-24 md:pt-20 font-sans  bg-gray-50/50 ">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">The Blog</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Explore our latest insights, technical deep-dives, and updates from the team.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="mt-12">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-200/50 rounded-2xl animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-600 text-xl font-medium mb-2">
              {isSearching ? `No results for "${debouncedQ}"` : "No posts available yet."}
            </p>
            {isSearching && <p className="text-gray-400">Try adjusting your search keywords.</p>}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
              <h3 className="text-lg font-bold text-gray-900">
                {isSearching ? 'Search Results' : 'Latest Articles'}
              </h3>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {results.length} {results.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            {results.map((post: SearchResult) => (
              <PostCard key={post.id} post={post} searchQuery={debouncedQ} />


            ))}
            
          </div>
        )}
      </div>
    </main>
  );
}
