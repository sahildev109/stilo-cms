import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePost } from '../hooks/usePosts';
import { Editor } from '../components/Editor';
import type { Block } from '@blocknote/core';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePost(slug!);  
  console.log(slug,data)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-xl text-gray-400 font-medium animate-pulse">Loading article...</div>
      </div>
    );
  }

  // Handle 404 gracefully
  if (error || !data || !data.post) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 text-center px-6">
        <h1 className="text-7xl font-extrabold text-gray-200 mb-6 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Post not found</h2>
        <p className="text-gray-500 text-lg mb-10 max-w-md">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 hover:bg-blue-50 px-6 py-3 rounded-xl transition-all">
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  const post =  data?.post; 
  const version = data?.version;

  // Render header values safely
  const dateStr = post.createdAt || post.created_at;
  const formattedDate = dateStr ? format(new Date(dateStr), 'MMMM d, yyyy') : '';
  const authorName = post.authorName || 'Staff'; // Fallback if author is not explicitly joined

  return (
    <article className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
        <Link to="/blog" className="inline-flex items-center gap-2 mb-10 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Blog
        </Link>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm md:text-base">
          {authorName && (
            <span className="font-semibold text-gray-800 bg-gray-100 px-4 py-1.5 rounded-full">{authorName}</span>
          )}
          {formattedDate && (
            <time dateTime={dateStr} className="text-gray-500 font-medium">Published on {formattedDate}</time>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 md:pb-32">
        <div className="bg-white px-2 py-4 md:p-8 rounded-2xl border border-gray-50 shadow-sm min-h-[400px]">
          {version?.content ? (
            <Editor
              initialContent={version.content as Block[]}
              onChange={() => { }} // No-op since it's read-only
              readOnly={true}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" />
              </svg>
              <p className="italic text-lg">No content available for this post.</p>
            </div>
          )}
        </div>
      </main>
    </article>
  );
}
