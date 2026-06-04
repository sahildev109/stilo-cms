'use strict';

const { v4: uuidv4 } = require('uuid');

function slugify(title) {
  const base = String(title || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  const suffix = uuidv4().split('-')[0];
  return `${base || 'post'}-${suffix}`;
}

module.exports = slugify;
