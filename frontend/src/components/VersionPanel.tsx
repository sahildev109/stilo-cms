import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useVersions, useRestoreVersion } from '../hooks/useVersions';

type Version = {
  id: string;
  versionNum: number;
  title: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
};

const CompareButton: React.FC<{ versionIds: string[], postId: string }> = ({ versionIds, postId }) => {
  const navigate = useNavigate();
  return (
    <button
      className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-medium"
      onClick={() => navigate(`/posts/${postId}/diff?a=${versionIds[0]}&b=${versionIds[1]}`)}
    >
      Compare Selected
    </button>
  );
};

const VersionCard: React.FC<{
  version: Version;
  isSelected: boolean;
  onToggle: () => void;
  postId: string;
}> = ({ version, isSelected, onToggle, postId }) => {
  const { mutate: restoreVersion } = useRestoreVersion();

  const handleRestore = () => {
    if (window.confirm('Are you sure you want to restore this version?')) {
      restoreVersion({ postId, versionId: version.id });
    }
  };

  return (
    <div className={`p-4 border-b flex flex-col gap-2 transition-colors ${isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}>
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isSelected} onChange={onToggle} className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
          <span className="font-bold bg-gray-200 px-2 py-1 rounded text-sm">v{version.versionNum}</span>
        </label>
        <span className="text-xs text-gray-500" title={new Date(version.createdAt).toLocaleString()}>
          {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
        </span>
      </div>
      <div className="text-sm text-gray-700">
        By {version.author.name}
      </div>
      <button
        onClick={handleRestore}
        className="text-xs text-blue-600 hover:text-blue-800 hover:underline self-start font-medium"
      >
        Restore this version
      </button>
    </div>
  );
};

export const VersionPanel: React.FC<{ postId: string }> = ({ postId }) => {
  const { data } = useVersions(postId);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(v => v !== id)
      : prev.length < 2 ? [...prev, id] : [prev[1], id] // max 2
    );
  };

  return (
    <aside className='version-panel w-72 border-l h-full overflow-y-auto bg-gray-50 shadow-inner flex flex-col'>
      <div className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h3 className="font-bold text-lg text-gray-800">Version History</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {data?.versions?.map((v: Version) => (
          <VersionCard
            key={v.id}
            version={v}
            isSelected={selected.includes(v.id)}
            onToggle={() => toggleSelect(v.id)}
            postId={postId}
          />
        ))}
        {data?.versions?.length === 0 && (
          <div className="p-4 text-gray-500 italic text-center">No versions available.</div>
        )}
      </div>
      {selected.length === 2 && (
        <div className="p-4 bg-white border-t sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <CompareButton versionIds={selected} postId={postId} />
        </div>
      )}
    </aside>
  );
};
export default VersionPanel;
