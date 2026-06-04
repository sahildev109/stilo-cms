'use strict';

// Recursively walks BlockNote JSON, extracts text content
function extractPlainText(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    const inlineText = (block.content ?? []).map(inline => {
      if (inline.type === 'text') return inline.text;
      if (inline.type === 'link') return (inline.content || []).map(c => c.text).join('');
      return '';
    }).join('');

    const childText = extractPlainText(block.children ?? []);

    return [inlineText, childText].filter(Boolean).join(' ');
  }).filter(Boolean).join(' ');
}

module.exports = extractPlainText;
