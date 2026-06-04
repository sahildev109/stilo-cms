import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  headline?: string;
  createdAt?: string;
  created_at?: string;
}

interface PostCardProps {
  post: SearchResult;
  searchQuery: string;
  isFeatured?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, searchQuery, isFeatured = false }) => {
  const dateStr = post.createdAt || post.created_at;
  const formattedDate = dateStr ? format(new Date(dateStr), 'MMMM d, yyyy') : '';

  // Estimate reading time based on content or excerpt length
  const wordCount = (post.excerpt || '').split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(2, Math.ceil(wordCount / 5) + 1); // rough estimate, min 2-3 mins

  return (
    <Link 
      to={`/blog/${post.slug}`} 
      className={`group relative block bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden ${
        isFeatured 
          ? 'p-8 md:p-10 md:grid md:grid-cols-5 md:gap-8 col-span-full' 
          : 'p-6 md:p-8 flex flex-col h-full'
      }`}
    >
      {/* Decorative hover gradient glow on the left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>

      <div className={`${isFeatured ? 'md:col-span-3 flex flex-col justify-center' : 'flex-1 flex flex-col'}`}>
        <div className="flex items-center gap-3 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {isFeatured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse animate-duration-1000"></span>
              Featured
            </span>
          )}
          {formattedDate && <span>{formattedDate}</span>}
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        <h2 className={`font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-4 ${
          isFeatured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
        }`}>
          {post.title}
        </h2>

        {!searchQuery || !post.headline ? (
          <p className="text-slate-500 text-base leading-relaxed line-clamp-3 mb-6">
            {post.excerpt || 'Discover the full story, research, and analysis behind this article.'}
          </p>
        ) : (
          <p 
            className="text-slate-600 text-base leading-relaxed mb-6 [&>mark]:bg-yellow-100 [&>mark]:text-yellow-900 [&>mark]:font-medium [&>mark]:px-1 [&>mark]:rounded-sm"
            dangerouslySetInnerHTML={{ __html: post.headline }} 
          />
        )}
      </div>

      <div className={`${
        isFeatured 
          ? 'md:col-span-2 md:border-l md:border-slate-100 md:pl-8 flex flex-col justify-between items-start pt-6 md:pt-0' 
          : 'mt-auto pt-4'
      }`}>
        {isFeatured && (
          <div className="hidden md:block mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Key Takeaway</h4>
            <p className="text-slate-500 text-sm leading-relaxed italic">
              {post.excerpt ? `"${post.excerpt.slice(0, 120)}..."` : '"Explore the detailed analysis and findings of our latest publication."'}
            </p>
          </div>
        )}

        <div className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors gap-1.5">
          Read Article
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};
export default PostCard;

