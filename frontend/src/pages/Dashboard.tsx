import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useDashboardPosts, useCreatePost, useToggleStatus, useDeletePost } from '../hooks/usePosts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = useDashboardPosts();
  const createPost = useCreatePost();
  const toggleStatus = useToggleStatus();
  const deletePost = useDeletePost();

  const handleCreateNew = async () => {
    try {
      // Default blocknote content structure: an empty paragraph
      const defaultContent = [{ type: "paragraph", content: [] }];
      const newPost = await createPost.mutateAsync({
        title: 'Untitled Post',
        content: defaultContent,
      });
      // Navigate to the editor for the newly created post
      console.log(newPost)
      navigate(`/posts/${newPost.post.id}/edit`);
    } catch (err) {
      console.error('Failed to create post', err);
      alert('Failed to create a new post. Please check the console for details.');
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deletePost.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-500 animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-red-500 font-medium">Failed to load posts.</div>
      </div>
    );
  }

  // Ensure posts is an array (handling possible wrapped payload cases gracefully)
  const postsArray = Array.isArray(posts) ? posts : (posts?.posts || []);

  return (
    <main className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your posts and drafts</p>
        </div>
        <button
          onClick={handleCreateNew}
          disabled={createPost.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {createPost.isPending ? (
            <span>Creating...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Post
            </>
          )}
        </button>
      </div>

      {postsArray.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts found</h3>
          <p className="text-gray-500 mb-6 max-w-md">You haven't written any posts yet. Click the button below to start crafting your first piece.</p>
          <button
            onClick={handleCreateNew}
            disabled={createPost.isPending}
            className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Versions</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {postsArray.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{post.slug ? `/${post.slug}` : 'No slug'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        post.status === 'published' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {post.status === 'published' ? (
                          <>
                            <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
                            Published
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 mr-1.5 bg-gray-400 rounded-full"></span>
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {post.createdAt || post.created_at ? format(new Date(post.createdAt || post.created_at), 'MMM d, yyyy') : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      <span className="bg-blue-50 text-blue-700 py-1 px-2.5 rounded-md border border-blue-100">
                        {post.latestVersion?.versionNum ?? 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button
                        onClick={() => navigate(`/posts/${post.id}/edit`)}
                        className="text-blue-600 hover:text-blue-900 hover:underline transition-colors focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleStatus.mutate(post.id)}
                        disabled={toggleStatus.isPending}
                        className={`${
                          post.status === 'published' ? 'text-amber-600 hover:text-amber-900' : 'text-emerald-600 hover:text-emerald-900'
                        } hover:underline transition-colors focus:outline-none disabled:opacity-50`}
                      >
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletePost.isPending}
                        className="text-red-600 hover:text-red-900 hover:underline transition-colors focus:outline-none disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
