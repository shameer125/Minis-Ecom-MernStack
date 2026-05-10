const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, generateToken, setAuthCookie, clearAuthCookie } = require('../middleware/auth');
const { sendVerificationEmail } = require('../utils/sendVerificationEmail');

const NAME_RE = /^[A-Za-z\s]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]+$/;

function validateRegistrationBody({ name, email, password, phone }) {
  const errors = {};

  if (!name || typeof name !== 'string') {
    errors.name = 'Name is required';
  } else {
    const trimmed = name.trim();
    if (!trimmed) errors.name = 'Name is required';
    else if (!NAME_RE.test(trimmed)) errors.name = 'Name may only contain letters and spaces';
  }

  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(email.trim().toLowerCase())) {
    errors.email = 'Enter a valid email address';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!phone || typeof phone !== 'string') {
    errors.phone = 'Phone is required';
  } else if (!PHONE_RE.test(phone.trim())) {
    errors.phone = 'Phone must contain only numbers';
  }

  return errors;
}

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const errors = validateRegistrationBody({ name, email, password, phone });
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const emailNorm = email.trim().toLowerCase();
  const exists = await User.findOne({ email: emailNorm });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({
    name: name.trim(),
    email: emailNorm,
    password,
    phone: phone.trim(),
    isVerified: false,
  });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenHash = await bcrypt.hash(rawToken, 12);
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.verificationTokenHash = verificationTokenHash;
  user.verificationTokenExpires = verificationTokenExpires;
  await user.save();

  const frontend =
    (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
  const verifyUrl = `${frontend}/verify-email?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(emailNorm)}`;

  try {
    await sendVerificationEmail({ to: emailNorm, verifyUrl });
  } catch (e) {
    await User.findByIdAndDelete(user._id);
    return res.status(502).json({
      message: 'Could not send verification email. Please try again later.',
    });
  }

  res.status(201).json({
    message: 'Account created. Check your email to verify your address before signing in.',
    email: user.email,
  });
}));

// GET /api/auth/verify-email?token=...&email=...
router.get('/verify-email', asyncHandler(async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email || typeof token !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ message: 'Invalid verification link' });
  }

  const emailNorm = email.trim().toLowerCase();
  const user = await User.findOne({ email: emailNorm }).select(
    '+verificationTokenHash +verificationTokenExpires',
  );
  if (!user) return res.status(400).json({ message: 'Invalid verification link' });
  if (user.isVerified) {
    return res.json({ message: 'Email is already verified. You can sign in.' });
  }
  if (!user.verificationTokenHash || !user.verificationTokenExpires) {
    return res.status(400).json({ message: 'Invalid verification link' });
  }
  if (user.verificationTokenExpires.getTime() < Date.now()) {
    return res.status(400).json({ message: 'Verification link has expired' });
  }

  const match = await bcrypt.compare(token, user.verificationTokenHash);
  if (!match) return res.status(400).json({ message: 'Invalid verification link' });

  user.isVerified = true;
  user.verificationTokenHash = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Email verified successfully. You can sign in now.' });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  if (!user.isAdmin && user.isVerified === false) {
    return res.status(403).json({
      message: 'Please verify your email before signing in. Check your inbox for the verification link.',
    });
  }

  const jwt = generateToken(user._id);
  setAuthCookie(res, jwt);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
  });
}));

// POST /api/auth/logout — clears HttpOnly auth cookie (no JWT required).
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
});

// GET /api/auth/profile
router.get('/profile', protect, asyncHandler(async (req, res) => {
  res.json(req.user);
}));

// PUT /api/auth/profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  if (req.body.address) user.address = { ...user.address, ...req.body.address };
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  const jwt = generateToken(updated._id);
  setAuthCookie(res, jwt);
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    isAdmin: updated.isAdmin,
    isVerified: updated.isVerified,
  });
}));

module.exports = router;
