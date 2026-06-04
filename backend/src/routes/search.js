'use strict';

const express = require('express');

const { searchPosts } = require('../services/searchService');

const router = express.Router();

router.get('/', async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q?.trim()) {
    return res.json({ results: [], total: 0 });
  }

  const response = await searchPosts(q, page, limit);
  res.json(response);
});

module.exports = router;
