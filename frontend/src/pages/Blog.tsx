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

  // Split results for layout: first one is featured when not searching
  const featuredPost = !isSearching && results.length > 0 ? results[0] : null;
  const otherPosts = !isSearching && results.length > 0 ? results.slice(1) : results;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 font-sans">
      {/* Hero section */}
      <div className="text-center mb-10 md:mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 mb-4 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Stilo Journal
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
          The Blog
        </h1>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Explore our latest insights, technical deep-dives, and updates from the team.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="mt-12">
        {isLoading ? (
          <div className="space-y-8">
            {/* Featured card skeleton */}
            {!isSearching && (
              <div className="h-64 bg-slate-100 rounded-2xl animate-pulse border border-slate-50"></div>
            )}
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse border border-slate-50"></div>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 shadow-sm max-w-2xl mx-auto">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-slate-700 text-lg font-semibold mb-1">
              {isSearching ? `No results for "${debouncedQ}"` : "No posts available yet."}
            </p>
            <p className="text-slate-400 text-sm">
              {isSearching ? "Try checking for spelling errors or adjusting your query terms." : "Check back later for new articles and updates."}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                {isSearching ? 'Search Results' : 'Latest Articles'}
              </h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {results.length} {results.length === 1 ? 'post' : 'posts'}
              </span>
            </div>

            {/* Featured Post (only shown when not searching and there are posts) */}
            {featuredPost && (
              <div className="mb-8 md:mb-10">
                <PostCard post={featuredPost} searchQuery={debouncedQ} isFeatured={true} />
              </div>
            )}

            {/* Grid of other posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {otherPosts.map((post: SearchResult) => (
                <PostCard key={post.id} post={post} searchQuery={debouncedQ} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

