import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getVersion, getVersions, restoreVersion } from '../api/posts';

export function useVersions(postId: string) {
  return useQuery({
    queryKey: ['versions', postId],
    queryFn: () => getVersions(postId),
    enabled: Boolean(postId)
  });
}

export function useVersion(postId: string, versionId: string) {
  return useQuery({
    queryKey: ['version', postId, versionId],
    queryFn: () => getVersion(postId, versionId),
    enabled: Boolean(postId) && Boolean(versionId)
  });
}

export function useRestoreVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, versionId }: { postId: string; versionId: string }) => restoreVersion(postId, versionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['versions', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['version', variables.postId] });
    }
  });
}
