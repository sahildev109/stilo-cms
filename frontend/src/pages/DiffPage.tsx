import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useVersion } from '../hooks/useVersions';
import { diffVersions } from '../utils/diff';
import { DiffView } from '../components/DiffView';
import { format } from 'date-fns';
import type { Block } from '@blocknote/core';

const DiffHeader: React.FC<{ versionA: any, versionB: any }> = ({ versionA, versionB }) => {
  if (!versionA || !versionB) return null;
  return (
    <div className="flex justify-between items-center p-6 border-b bg-white shadow-sm mb-6 rounded-lg border border-gray-200">
      <div className="flex flex-col flex-1">
        <span className="font-bold text-lg text-gray-800">Version {versionA.versionNum}</span>
        <span className="text-sm text-gray-500">{format(new Date(versionA.createdAt), 'PPP p')}</span>
      </div>
      <div className="text-2xl font-bold text-gray-300 px-4">&rarr;</div>
      <div className="flex flex-col flex-1 items-end">
        <span className="font-bold text-lg text-gray-800">Version {versionB.versionNum}</span>
        <span className="text-sm text-gray-500">{format(new Date(versionB.createdAt), 'PPP p')}</span>
      </div>
    </div>
  );
};

export default function DiffPage() {
  const { postId } = useParams<{ postId: string }>();
  console.log(postId);
  const [params] = useSearchParams();

  const aId = params.get('a')!;
  const bId = params.get('b')!;

  const { data: vA } = useVersion(postId!, aId);
  const { data: vB } = useVersion(postId!, bId);
  console.log(vA,vB)

  const diffs = useMemo(() => {
    if (!vA?.version || !vB?.version) return [];
    return diffVersions(vA.version.content as Block[], vB.version.content as Block[]);
  }, [vA, vB]);

  return (
    <main className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Compare Versions</h1>
        <Link to={`/posts/${postId}/edit`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
          &larr; Back to Editor
        </Link>
      </div>
      
      {!vA || !vB ? (
        <div className="text-center py-12 text-gray-500">Loading versions...</div>
      ) : (
        <>
          <DiffHeader versionA={vA.version} versionB={vB.version} />
          {diffs.length > 0 ? (
            <DiffView diffs={diffs} />
          ) : (
            <div className="p-8 text-center bg-white border rounded-lg shadow-sm">
              <p className="text-gray-500 italic text-lg">No changes between these versions.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
