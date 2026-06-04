import React from 'react';
import type { BlockDiff } from '../utils/diff';

// Simple helper to extract plain text from block content
const renderBlockContent = (block: any) => {
  if (!block) return '';
  const inlineContent = Array.isArray(block.content) ? block.content : [];
  return inlineContent.map((inline: any) => {
    if (inline.type === 'text') return inline.text;
    if (inline.type === 'link') return inline.content.map((c: any) => c.text).join('');
    return '';
  }).join('');
};

const DiffBlock: React.FC<{ className: string; block: any }> = ({ className, block }) => (
  <div className={`p-3 my-2 rounded shadow-sm ${className}`}>
    {renderBlockContent(block)}
  </div>
);

export const DiffView: React.FC<{ diffs: BlockDiff[] }> = ({ diffs }) => (
  <div className='diff-view flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100'>
    {diffs.map(block => {
      if (block.status === 'unchanged') return null; // hide unchanged for clarity

      if (block.status === 'added')
        return <DiffBlock key={block.blockId} className='diff-added bg-green-100 border-l-4 border-green-500 text-green-900' block={block.content} />;
      
      if (block.status === 'removed')
        return <DiffBlock key={block.blockId} className='diff-removed bg-red-100 border-l-4 border-red-500 line-through opacity-70 text-red-900' block={block.content} />;

      // changed: render inline spans
      return (
        <div key={block.blockId} className='diff-changed p-3 my-2 border-l-4 border-yellow-400 bg-yellow-50 rounded shadow-sm text-gray-800 leading-relaxed'>
          {block.spans!.map((span, i) => (
            <span key={i} className={`diff-span diff-span--${span.op} ${
              span.op === 'added' ? 'bg-green-200 text-green-900 px-1 rounded-sm' :
              span.op === 'removed' ? 'bg-red-200 text-red-900 line-through opacity-70 px-1 rounded-sm' :
              ''
            }`}>
              {span.text}
            </span>
          ))}
        </div>
      );
    })}
  </div>
);
export default DiffView;
