import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePost, useUpdatePost, useToggleStatus } from '../hooks/usePosts';
import { Editor } from '../components/Editor';
import VersionPanel from '../components/VersionPanel';
import type { Block } from '@blocknote/core';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch the post and its latest version content
  const { data, isLoading, error } = usePost(id!);
  const updatePost = useUpdatePost();
  const toggleStatus = useToggleStatus();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<Block[] | undefined>(undefined);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadedVersionId = useRef<string | null>(null);

  useEffect(() => {
    if (data?.version && data.version.id !== loadedVersionId.current) {
      setTitle(data.version.title || '');
      setContent(data.version.content as Block[]);
      loadedVersionId.current = data.version.id;
    }
  }, [data?.version]);

  const handleSave = async () => {
    if (!title || !content) return;
    setSaveStatus('saving');
    try {
      await updatePost.mutateAsync({ id: id!, data: { title, content } });
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus('idle');
      alert('Failed to save changes.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-500 animate-pulse">Loading editor...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500 font-medium">Failed to load the post.</div>
      </div>
    );
  }

  const post = data.post;

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 font-medium transition-colors flex items-center gap-1 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Dashboard
          </Link>
          <div className="h-6 border-r border-gray-300"></div>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            placeholder="Post Title"
            className="flex-1 max-w-sm text-sm font-semibold text-gray-800 placeholder-gray-400 border border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 outline-none transition-all"
          />

          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border shrink-0 ${
            post?.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            {post?.status === 'published' ? 'Published' : 'Draft'}
          </span>
          <div className="w-20 shrink-0 flex items-center">
            {saveStatus === 'saving' && <span className="text-sm font-medium text-amber-500">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-sm font-medium text-green-500">Saved</span>}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button
            onClick={() => toggleStatus.mutate(id!)}
            disabled={toggleStatus.isPending}
            className={`flex items-center justify-center min-w-[100px] px-4 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-75 ${
              post?.status === 'published' 
                ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' 
                : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
            }`}
          >
            {toggleStatus.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {post?.status === 'published' ? 'Unpublishing...' : 'Publishing...'}
              </span>
            ) : (
              post?.status === 'published' ? 'Unpublish' : 'Publish'
            )}
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors border ${
              isSidebarOpen ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isSidebarOpen ? 'Close History' : 'Version History'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto w-full p-8 md:p-12 md:pt-16">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              placeholder="Post Title"
              className="w-full text-4xl md:text-5xl font-extrabold text-gray-900 placeholder-gray-300 border-none focus:ring-0 outline-none mb-8 px-12 bg-transparent"
            />
            
            <div 
              onBlur={(e) => {
                // If focus moves outside the entire editor area, trigger a save
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleSave();
                }
              }}
              className="min-h-[500px]"
            >
              {content !== undefined && loadedVersionId.current && (
                <Editor
                  key={loadedVersionId.current}
                  initialContent={content}
                  onChange={(blocks) => setContent(blocks)}
                />
              )}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-80 border-l bg-gray-50 flex-shrink-0 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
            <VersionPanel postId={id!} />
          </div>
        )}
      </div>
    </div>
  );
}
