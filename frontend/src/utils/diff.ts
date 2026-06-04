import fastDiff from 'fast-diff';
import type { Block } from '@blocknote/core';

const { DELETE: DIFF_DELETE, EQUAL: DIFF_EQUAL, INSERT: DIFF_INSERT } = fastDiff;

export type DiffOp = 'added' | 'removed' | 'unchanged';
export type DiffSpan = { text: string; op: DiffOp };
export type BlockDiff = {
  blockId: string;
  status: 'added' | 'removed' | 'changed' | 'unchanged';
  blockType: string;
  spans?: DiffSpan[];
  content?: unknown;
};

function blockToPlainText(block: Block) {
  const inlineContent = Array.isArray(block.content) ? block.content : [];

  return inlineContent.map(inline => {
    if (inline.type === 'text') return inline.text;
    if (inline.type === 'link') return inline.content.map(content => content.text).join('');
    return '';
  }).join('');
}

export function diffVersions(versionA: Block[], versionB: Block[]): BlockDiff[] {
  const mapA = new Map(versionA.map(block => [block.id, block]));
  const mapB = new Map(versionB.map(block => [block.id, block]));

  const allIds = [
    ...versionA.map(block => block.id),
    ...versionB.filter(block => !mapA.has(block.id)).map(block => block.id)
  ];

  return allIds.map(id => {
    const a = mapA.get(id);
    const b = mapB.get(id);

    if (!a) return { blockId: id, status: 'added', blockType: b!.type, content: b };
    if (!b) return { blockId: id, status: 'removed', blockType: a.type, content: a };

    const textA = blockToPlainText(a);
    const textB = blockToPlainText(b);

    if (textA === textB && a.type === b.type) {
      return { blockId: id, status: 'unchanged', blockType: a.type, content: b };
    }

    const rawDiff = fastDiff(textA, textB);

    const spans: DiffSpan[] = rawDiff.map(([op, text]) => ({
      text,
      op: op === DIFF_INSERT ? 'added' : op === DIFF_DELETE ? 'removed' : 'unchanged'
    }));

    return { blockId: id, status: 'changed', blockType: b.type, spans };
  });
}
