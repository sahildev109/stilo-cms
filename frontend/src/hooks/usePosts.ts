import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPost, deletePost, getPost, getPosts, getDashboardPosts, toggleStatus, updatePost, type PostPayload } from '../api/posts';

export function usePostList() {
  return useQuery({ queryKey: ['posts'], queryFn: async () => await getPosts() });
}

export function useDashboardPosts() {
  return useQuery({ queryKey: ['dashboardPosts'], queryFn: async () => await getDashboardPosts() });  
}

export function usePost(slug: string) {
  return useQuery({ queryKey: ['post', slug], queryFn: async () => await getPost(slug), enabled: Boolean(slug) });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostPayload) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardPosts'] });
    }
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Pick<PostPayload, 'title' | 'content'> }) => updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardPosts'] });
    }
  });
}

export function useToggleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleStatus(id),
    onSuccess: (data, id) => {
      // Synchronously update the specific post in the cache so the UI updates instantly
      queryClient.setQueryData(['post', id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          post: {
            ...oldData.post,
            status: data.post.status
          }
        };
      });

      // Do not return the promise so the mutation completes immediately, matching the snappy cache update
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboardPosts'] }),
        queryClient.invalidateQueries({ queryKey: ['post', id] })
      ]);
    }
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardPosts'] });
    }
  });
}
