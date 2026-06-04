import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '../api/search';

export function useSearch(q: string) {
  return useQuery({
    queryKey: ['search', q],
    queryFn: () => searchPosts(q),
    enabled: Boolean(q.trim()),
  });
}
