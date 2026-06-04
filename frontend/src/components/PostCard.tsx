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
}

export const PostCard: React.FC<PostCardProps> = ({ post, searchQuery }) => {
  const dateStr = post.createdAt || post.created_at;
  const formattedDate = dateStr ? format(new Date(dateStr), 'MMM d, yyyy') : '';

  return (
    <Link to={`/blog/${post.slug}`} className="block bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 mb-6 group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{post.title}</h2>
        {formattedDate && <span className="text-sm font-medium text-gray-400 shrink-0 mt-2 ml-6 hidden sm:block">{formattedDate}</span>}
      </div>
      
      {!searchQuery || !post.headline ? (
        <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">{post.excerpt || 'Read more to explore this article.'}</p>
      ) : (
        <p 
          className="text-gray-700 text-lg leading-relaxed [&>mark]:bg-yellow-200 [&>mark]:text-yellow-900 [&>mark]:font-medium [&>mark]:px-1 [&>mark]:rounded-sm [&>mark]:shadow-sm"
          dangerouslySetInnerHTML={{ __html: post.headline }} 
        />
      )}
      
      <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
        Read Article
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );
};
export default PostCard;
