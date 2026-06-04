'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const authenticate = require('../middleware/auth');
const db = require('../models');
const slugify = require('../utils/slugify');
const { savePost, updatePost } = require('../services/postService');

const router = express.Router();
const { Post, PostVersion, User } = db;

function mapPost(post, latestVersion) {
  return {
    id: post.id,
    authorId: post.authorId,
    authorName: post.User?.name || 'Unknown',
    title: latestVersion?.title ?? post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: post.status,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    latestVersion: latestVersion ? {
      id: latestVersion.id,
      versionNum: latestVersion.versionNum,
      title: latestVersion.title,
      content: latestVersion.content,
      plainText: latestVersion.plainText,
      createdAt: latestVersion.createdAt,
      authorId: latestVersion.authorId
    } : null
  };
}

async function loadLatestVersionsForPosts(posts) {
  if (!posts.length) return new Map();

  const versions = await PostVersion.findAll({
    where: { postId: posts.map(post => post.id) },
    order: [['postId', 'ASC'], ['versionNum', 'DESC']]
  });

  const latestByPostId = new Map();
  for (const version of versions) {
    if (!latestByPostId.has(version.postId)) {
      latestByPostId.set(version.postId, version);
    }
  }

  return latestByPostId;
}

async function loadLatestVersion(postId) {
  return PostVersion.findOne({
    where: { postId },
    order: [['versionNum', 'DESC']]
  });
}

async function getAuthUserFromHeader(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  return jwt.verify(token, process.env.JWT_SECRET);
}

router.post('/', authenticate, async (req, res) => {
  const { title, content, excerpt } = req.body ?? {};

  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const result = await db.sequelize.transaction(async transaction => {
    const post = await Post.create({
      authorId: req.user.id,
      title,
      slug: slugify(title),
      excerpt: excerpt ?? null,
      status: 'draft'
    }, { transaction });

    const version = await savePost(post.id, req.user.id, { title, content }, transaction);
    
    // Fetch the post again to include User association for mapPost
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{ model: User, attributes: ['name'] }],
      transaction
    });

    return { post: fullPost, version };
  });

  res.status(201).json(result);
});

router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    where: { status: 'published' },
    include: [{ model: User, attributes: ['name'] }],
    order: [['createdAt', 'DESC']]
  });

  const latestVersions = await loadLatestVersionsForPosts(posts);

  res.json({
    posts: posts.map(post => {
      const latestVersion = latestVersions.get(post.id);
      return mapPost(post, latestVersion);
    })
  });
});

router.get('/me', authenticate, async (req, res) => {
  const posts = await Post.findAll({
    where: { authorId: req.user.id },
    include: [{ model: User, attributes: ['name'] }],
    order: [['createdAt', 'DESC']]
  });

  const latestVersions = await loadLatestVersionsForPosts(posts);

  res.json({
    posts: posts.map(post => {
      const latestVersion = latestVersions.get(post.id);
      return mapPost(post, latestVersion);
    })
  });
});

router.get('/:slug', async (req, res) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(req.params.slug);
  const where = isUUID ? { id: req.params.slug } : { slug: req.params.slug };
  const post = await Post.findOne({ 
    where,
    include: [{ model: User, attributes: ['name'] }]
  });

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  let user = null;
  if (post.status === 'draft') {
    try {
      user = await getAuthUserFromHeader(req);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!user) {
      return res.status(401).json({ error: 'No token' });
    }

    if (user.id !== post.authorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  const latestVersion = await loadLatestVersion(post.id);

  res.json({
    post: mapPost(post, latestVersion),
    version: latestVersion
  });
});

router.put('/:id', authenticate, async (req, res) => {
  const { title, content } = req.body ?? {};

  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  const post = await Post.findByPk(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const version = await updatePost(post.id, req.user.id, { title, content });
  res.json({ version });
});

router.patch('/:id/status', authenticate, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const nextStatus = post.status === 'draft' ? 'published' : 'draft';
  await post.update({ status: nextStatus, updatedAt: new Date() });

  res.json({ post });
});

router.delete('/:id', authenticate, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await db.sequelize.transaction(async transaction => {
    await PostVersion.destroy({ where: { postId: post.id }, transaction });
    await post.destroy({ transaction });
  });

  res.status(204).send();
});

module.exports = router;
