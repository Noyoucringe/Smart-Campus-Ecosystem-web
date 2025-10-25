const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-change-in-prod';
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || 'klh.edu.in';
const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_PASS = process.env.GMAIL_PASS || '';

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

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user;
  // remove sensitive fields if any
  return res.json({ user });
});

if (!GMAIL_USER || !GMAIL_PASS) {
  console.warn('GMAIL_USER or GMAIL_PASS not set — email OTP delivery will not work until set in .env');
}

// nodemailer transporter using Gmail SMTP (app password recommended)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  }
});

// POST /api/auth/signup
// body: { email, name, password }
router.post('/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    let user = await User.findOne({ email });
    if (user && user.isVerified) return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const otpCode = (Math.floor(100000 + Math.random() * 900000)).toString();
    const otpExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    if (!user) {
      user = new User({ email, name, passwordHash, isVerified: false, otpCode, otpExpires });
    } else {
      user.passwordHash = passwordHash;
      user.otpCode = otpCode;
      user.otpExpires = otpExpires;
      user.isVerified = false;
      if (name) user.name = name;
    }
    await user.save();

    // send OTP via email (if configured)
    let devOtp = null;
    if (GMAIL_USER && GMAIL_PASS) {
      const mail = {
        from: GMAIL_USER,
        to: email,
        subject: 'Your Campus OTP Code',
        text: `Your verification code is ${otpCode}. It expires in 15 minutes.`,
      };
      transporter.sendMail(mail).catch((e) => console.error('OTP email error', e));
    } else {
      // in dev mode (no SMTP) return OTP in response to simplify testing
      devOtp = otpCode;
    }

    return res.status(200).json({ ok: true, message: 'OTP sent to email', otp: devOtp });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /api/auth/verify-otp
// body: { email, otp }
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ error: 'Missing email or otp' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });
    if (!user.otpCode || !user.otpExpires) return res.status(400).json({ error: 'No OTP pending' });
    if (new Date() > new Date(user.otpExpires)) return res.status(400).json({ error: 'OTP expired' });
    if (String(otp).trim() !== String(user.otpCode).trim()) return res.status(400).json({ error: 'Invalid OTP' });

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  } catch (err) {
    console.error('Verify OTP error', err);
    return res.status(500).json({ error: 'OTP verification failed' });
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
