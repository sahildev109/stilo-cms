'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const db = require('../models');
const { JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES } = require('../config/jwt');

const router = express.Router();
const { User, RefreshToken } = db;

function parseDurationToMs(duration) {
  const match = String(duration || '').trim().match(/^(\d+)(ms|s|m|h|d)$/i);

  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return value * multipliers[unit];
}

function createAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES }
  );
}

async function createRefreshToken(userId) {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + parseDurationToMs(JWT_REFRESH_EXPIRES));

  await RefreshToken.create({
    id: uuidv4(),
    userId,
    token,
    expiresAt
  });

  return { token, expiresAt };
}

async function issueTokens(user) {
  const accessToken = createAccessToken(user);
  const { token: refreshToken } = await createRefreshToken(user.id);

  return { accessToken, refreshToken };
}

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body ?? {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password, and name are required' });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ email, password: hashedPassword, name });
  const tokens = await issueTokens(user);

  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, ...tokens });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const tokens = await issueTokens(user);
  res.json({ user: { id: user.id, email: user.email, name: user.name }, ...tokens });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body ?? {};

  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required' });
  }

  const tokenRecord = await RefreshToken.findOne({ where: { token: refreshToken } });
  if (!tokenRecord) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  if (tokenRecord.expiresAt && new Date(tokenRecord.expiresAt) <= new Date()) {
    await tokenRecord.destroy();
    return res.status(401).json({ error: 'Refresh token expired' });
  }

  const user = await User.findByPk(tokenRecord.userId);
  if (!user) {
    await tokenRecord.destroy();
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  await tokenRecord.destroy();
  const { refreshToken: nextRefreshToken } = await createRefreshToken(user.id);
  const accessToken = createAccessToken(user);

  res.json({ 
    accessToken, 
    refreshToken: nextRefreshToken,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body ?? {};

  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required' });
  }

  await RefreshToken.destroy({ where: { token: refreshToken } });
  res.status(204).send();
});

module.exports = router;
