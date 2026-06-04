'use strict';

const db = require('../models');
const extractPlainText = require('../utils/extractPlainText');

const { Post, PostVersion } = db;

async function savePost(postId, authorId, { title, content }, transaction) {
  const plainText = extractPlainText(content);

  const maxVersion = (await PostVersion.max('versionNum', {
    where: { postId },
    transaction
  })) ?? 0;

  const version = await PostVersion.create({
    postId,
    authorId,
    versionNum: maxVersion + 1,
    title,
    content,
    plainText
  }, { transaction });

  await Post.update(
    { title, updatedAt: new Date() },
    { where: { id: postId }, transaction }
  );

  return version;
}

async function updatePost(postId, authorId, data) {
  return db.sequelize.transaction(t => savePost(postId, authorId, data, t));
}

module.exports = {
  savePost,
  updatePost
};
