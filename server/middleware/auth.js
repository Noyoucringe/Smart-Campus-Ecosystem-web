const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-change-in-prod';

async function auth(req, res, next) {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.userId) return res.status(401).json({ message: 'Invalid token' });
    // attach user basic info to req
    const user = await User.findById(decoded.userId).lean();
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message || err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

module.exports = auth;
