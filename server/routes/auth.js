const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
// Removed nodemailer/SMPP usage - using Firebase for authentication/authorization
const admin = require('firebase-admin');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-change-in-prod';
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'klh.edu.in';
// Gmail SMTP removed; backend will no longer send OTP emails.
// Firebase admin service account options
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT || '';
const FIREBASE_SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '';

if (!GOOGLE_CLIENT_ID) {
  console.warn('GOOGLE_CLIENT_ID not set — Google ID token verification will fail until set in .env');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// POST /api/auth/google
// body: { idToken }
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

    const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: 'Invalid id token' });

    const email = payload.email;
    const domain = (email || '').split('@')[1] || '';
    if (!domain || !domain.endsWith(ALLOWED_DOMAIN)) {
      return res.status(403).json({ error: 'Only college emails are allowed to register' });
    }

    // find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        googleId: payload.sub,
        email,
        name: payload.name,
        picture: payload.picture,
        role: 'student',
      });
      await user.save();
    } else {
      // update googleId/picture/name if changed
      let changed = false;
      if (!user.googleId && payload.sub) { user.googleId = payload.sub; changed = true; }
      if (payload.picture && user.picture !== payload.picture) { user.picture = payload.picture; changed = true; }
      if (payload.name && user.name !== payload.name) { user.name = payload.name; changed = true; }
      if (changed) await user.save();
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user });
  } catch (err) {
    console.error('Google auth error', err);
    return res.status(500).json({ error: 'Google authentication failed' });
  }
});

// POST /api/auth/firebase-login
// body: { idToken }
router.post('/firebase-login', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

    // verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded) return res.status(400).json({ error: 'Invalid id token' });

    const email = decoded.email;
    const domain = (email || '').split('@')[1] || '';
    if (!domain || !domain.endsWith(ALLOWED_DOMAIN)) {
      return res.status(403).json({ error: 'Only college emails are allowed to register' });
    }

    // find or create user (mark as verified)
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        firebaseUid: decoded.uid,
        email,
        name: decoded.name || '',
        picture: decoded.picture || '',
        role: 'student',
        isVerified: true,
      });
      await user.save();
    } else {
      let changed = false;
      if (!user.firebaseUid && decoded.uid) { user.firebaseUid = decoded.uid; changed = true; }
      if (decoded.picture && user.picture !== decoded.picture) { user.picture = decoded.picture; changed = true; }
      if (decoded.name && user.name !== decoded.name) { user.name = decoded.name; changed = true; }
      if (!user.isVerified) { user.isVerified = true; changed = true; }
      if (changed) await user.save();
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  } catch (err) {
    console.error('Firebase auth error', err);
    return res.status(500).json({ error: 'Firebase authentication failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user;
  // remove sensitive fields if any
  return res.json({ user });
});


// Initialize firebase-admin
try {
  if (FIREBASE_SERVICE_ACCOUNT) {
    const svc = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(svc) });
    console.log('firebase-admin initialized from FIREBASE_SERVICE_ACCOUNT');
  } else if (FIREBASE_SERVICE_ACCOUNT_PATH) {
    const svc = require(FIREBASE_SERVICE_ACCOUNT_PATH);
    admin.initializeApp({ credential: admin.credential.cert(svc) });
    console.log('firebase-admin initialized from FIREBASE_SERVICE_ACCOUNT_PATH');
  } else {
    admin.initializeApp();
    console.log('firebase-admin initialized with application default credentials');
  }
} catch (e) {
  console.warn('firebase-admin initialization failed:', e && e.message ? e.message : e);
}

// nodemailer transporter using Gmail SMTP (app password recommended)
// Use explicit host/port so errors are more obvious and configuration works across environments.
// SMTP removed — we no longer attempt to send OTP emails from the backend.
console.log('SMTP configuration removed: backend will not send OTP emails. Use Firebase for authentication/authorization.');

// POST /api/auth/signup
// body: { email, name, password }
router.post('/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    let user = await User.findOne({ email });
    if (user && user.isVerified) return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    if (!user) {
      user = new User({ email, name, passwordHash, isVerified: true });
    } else {
      user.passwordHash = passwordHash;
      user.isVerified = true;
      if (name) user.name = name;
    }
    await user.save();

    // Since SMTP has been removed, mark user as verified and return a JWT so the client can proceed.
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token, user });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /api/auth/login
// body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (!user.passwordHash) return res.status(400).json({ error: 'Password auth not configured' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ error: 'Email not verified' });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
