import api from './client';

export async function searchPosts(q: string, page = 1, limit = 10) {
  const { data } = await api.get('/search', {
    params: { q, page, limit }
  });

  return data as {
    results: Array<Record<string, unknown>>;
    total: number;
  };
}
