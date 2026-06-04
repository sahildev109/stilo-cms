import api from './client';

export type PostPayload = {
  title: string;
  content: unknown;
  excerpt?: string | null;
  status?: 'draft' | 'published';
};

export async function getPosts() {
  const { data } = await api.get('/posts');
  return data;
}

export async function getDashboardPosts() {
  const { data } = await api.get('/posts/me');
  return data;
}

export async function getPost(slug: string) {
  const { data } = await api.get(`/posts/${slug}`);
  return data;
}

export async function createPost(data: PostPayload) {
  const response = await api.post('/posts', data);
  return response.data;
}

export async function updatePost(id: string, data: Pick<PostPayload, 'title' | 'content'>) {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
}

export async function toggleStatus(id: string) {
  const response = await api.patch(`/posts/${id}/status`);
  return response.data;
}

export async function deletePost(id: string) {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
}

export async function getVersions(postId: string) {
  const { data } = await api.get(`/posts/${postId}/versions`);
  return data as { versions: Array<Record<string, unknown>> };
}

export async function getVersion(postId: string, versionId: string) {
  const { data } = await api.get(`/posts/${postId}/versions/${versionId}`);
  return data;
}

export async function restoreVersion(postId: string, versionId: string) {
  const { data } = await api.post(`/posts/${postId}/versions/${versionId}/restore`);
  return data;
}
