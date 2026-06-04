'use strict';

const express = require('express');

const authenticate = require('../middleware/auth');
const db = require('../models');
const { savePost } = require('../services/postService');

const router = express.Router();
const { Post, PostVersion, User } = db;

async function requireOwnedPost(postId, userId) {
  const post = await Post.findByPk(postId);

  if (!post) {
    return { error: { status: 404, message: 'Post not found' } };
  }

  if (post.authorId !== userId) {
    return { error: { status: 403, message: 'Forbidden' } };
  }

  return { post };
}

async function loadAuthors(authorIds) {
  if (!authorIds.length) return new Map();

  const authors = await User.findAll({
    where: { id: authorIds }
  });

  return new Map(authors.map(author => [author.id, author]));
}

function serializeVersion(version, author) {
  return {
    id: version.id,
    versionNum: version.versionNum,
    title: version.title,
    createdAt: version.createdAt,
    author: {
      id: author.id,
      name: author.name
    }
  };
}

router.get('/:postId/versions', authenticate, async (req, res) => {
  const { postId } = req.params;
  const ownership = await requireOwnedPost(postId, req.user.id);

  if (ownership.error) {
    return res.status(ownership.error.status).json({ error: ownership.error.message });
  }

  const versions = await PostVersion.findAll({
    where: { postId },
    order: [['versionNum', 'DESC']]
  });

  const authors = await loadAuthors([...new Set(versions.map(version => version.authorId))]);

  res.json({
    versions: versions.map(version => serializeVersion(version, authors.get(version.authorId)))
  });
});

router.get('/:postId/versions/:versionId', authenticate, async (req, res) => {
  const { postId, versionId } = req.params;
  const ownership = await requireOwnedPost(postId, req.user.id);

  if (ownership.error) {
    return res.status(ownership.error.status).json({ error: ownership.error.message });
  }

  const version = await PostVersion.findOne({
    where: { id: versionId, postId }
  });

  if (!version) {
    return res.status(404).json({ error: 'Version not found' });
  }

  res.json({ version });
});

router.post('/:postId/versions/:versionId/restore', authenticate, async (req, res) => {
  const { postId, versionId } = req.params;
  const ownership = await requireOwnedPost(postId, req.user.id);

  if (ownership.error) {
    return res.status(ownership.error.status).json({ error: ownership.error.message });
  }

  const targetVersion = await PostVersion.findOne({
    where: { id: versionId, postId }
  });

  if (!targetVersion) {
    return res.status(404).json({ error: 'Version not found' });
  }

  const result = await db.sequelize.transaction(async transaction => {
    const newVersion = await savePost(
      postId,
      req.user.id,
      { title: targetVersion.title, content: targetVersion.content },
      transaction
    );

    return {
      message: `Restored to version ${targetVersion.versionNum}`,
      newVersion
    };
  });

  res.json(result);
});

module.exports = router;
