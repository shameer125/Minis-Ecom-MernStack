const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const SmsRegisterOtp = require('../models/SmsRegisterOtp');
const { protect, generateToken, setAuthCookie, clearAuthCookie } = require('../middleware/auth');
const { sendVerificationEmail } = require('../utils/sendVerificationEmail');
const { validateShoppingEmail } = require('../utils/emailValidation');
const {
  smsSignupConfigured,
  normalizeForSmsE164Digits,
  deliverSms,
  generateSmsOtp,
  hashOtp,
  verifyOtp,
} = require('../utils/registerSms');


const NAME_RE = /^[A-Za-z\s]+$/;
const PHONE_RE = /^[0-9]+$/;

function smsCooldownMs() {
  const n = Number(process.env.SMS_RESEND_SECONDS);
  return Number.isFinite(n) && n >= 30 ? n * 1000 : 55_000;
}

function validateRegistrationBody({ name, email, password, phone, phoneOtp }, opts = {}) {
  const { requirePhoneOtp } = opts;
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
  } else {
    const ev = validateShoppingEmail(email);
    if (!ev.ok) errors.email = ev.message;
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

  if (requirePhoneOtp) {
    const code = typeof phoneOtp === 'string' ? phoneOtp.trim() : '';
    if (!/^[0-9]{6}$/.test(code)) errors.phoneOtp = 'Enter the 6-digit code sent to your phone';
  }

  return errors;
}

// GET /api/auth/register-options
router.get('/register-options', (req, res) => {
  res.json({
    phoneVerificationRequired: smsSignupConfigured(),
    smsResendCooldownSeconds: Math.round(smsCooldownMs() / 1000),
  });
});

// POST /api/auth/register/send-phone-code
router.post(
  '/register/send-phone-code',
  asyncHandler(async (req, res) => {
    if (!smsSignupConfigured()) {
      return res.status(503).json({ message: 'Phone verification SMS is not configured on this server' });
    }

    const { phone } = req.body;
    if (!phone || typeof phone !== 'string' || !PHONE_RE.test(phone.trim())) {
      return res.status(400).json({ message: 'Enter a valid phone number', errors: { phone: 'Phone must contain only digits' } });
    }

    const digits = normalizeForSmsE164Digits(phone.trim());
    if (!digits || digits.length < 10) {
      return res.status(400).json({ message: 'Phone number looks invalid', errors: { phone: 'Check your phone number format' } });
    }

    const prev = await SmsRegisterOtp.findOne({ phone: digits }).select('+otpHash');
    if (prev?.updatedAt && Date.now() - new Date(prev.updatedAt).getTime() < smsCooldownMs()) {
      return res.status(429).json({ message: 'Please wait before requesting another code.' });
    }

    const otp = generateSmsOtp();
    const otpHash = await hashOtp(otp);

    await SmsRegisterOtp.findOneAndUpdate(
      { phone: digits },
      {
        phone: digits,
        otpHash,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    try {
      await deliverSms(
        digits,
        `MINIS: Your sign-up verification code is ${otp}. Expires in 15 minutes.`,
      );
    } catch (e) {
      await SmsRegisterOtp.deleteOne({ phone: digits });
      return res.status(502).json({
        message: 'Could not send SMS. Please try again later.',
      });
    }

    res.json({ message: 'Verification code sent to your phone number.' });
  }),
);

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, phone, phoneOtp } = req.body;
  const requirePhoneOtp = smsSignupConfigured();
  const errors = validateRegistrationBody(
    { name, email, password, phone, phoneOtp },
    { requirePhoneOtp },
  );

  const emailVe = validateShoppingEmail(email);
  const emailNorm = emailVe.ok ? emailVe.normalized : '';

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const exists = await User.findOne({ email: emailNorm });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const phoneDigitsNormalized = normalizeForSmsE164Digits(phone.trim());
  let smsRow;

  if (requirePhoneOtp) {
    const code = typeof phoneOtp === 'string' ? phoneOtp.trim() : '';
    smsRow = await SmsRegisterOtp.findOne({ phone: phoneDigitsNormalized }).select('+otpHash');
    if (!smsRow) return res.status(400).json({ message: 'Request a verification code first', errors: { phoneOtp: 'Tap Send code on your phone' } });
    if (smsRow.expires.getTime() < Date.now()) {
      await SmsRegisterOtp.deleteOne({ _id: smsRow._id });
      return res.status(400).json({ message: 'Code expired', errors: { phoneOtp: 'Request a new code' } });
    }
    const match = await verifyOtp(code, smsRow.otpHash);
    if (!match) return res.status(400).json({ message: 'Invalid code', errors: { phoneOtp: 'Incorrect code' } });
  }

  const user = await User.create({
    name: name.trim(),
    email: emailNorm,
    password,
    phone: phone.trim(),
    isVerified: false,
  });

  if (smsRow) await SmsRegisterOtp.deleteOne({ _id: smsRow._id });

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

  if (smsSignupConfigured() && phoneDigitsNormalized) {
    try {
      await deliverSms(
        phoneDigitsNormalized,
        'MINIS: Your shopping account has been created. Open your email to verify your inbox, then sign in anytime.',
      );
    } catch (_) {
      /* optional welcome SMS; account still created */
    }
  }

  res.status(201).json({
    message: requirePhoneOtp
      ? 'Account created — check SMS and email. Verify your email before signing in.'
      : 'Account created. Check your email to verify your address before signing in.',
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

  const phoneDigitsNormalized = smsSignupConfigured()
    ? normalizeForSmsE164Digits(String(user.phone || '').trim())
    : '';
  const loginAlerts = String(process.env.SMS_LOGIN_ALERT || '').toLowerCase() === 'true';
  if (loginAlerts && smsSignupConfigured() && phoneDigitsNormalized) {
    try {
      await deliverSms(
        phoneDigitsNormalized,
        `MINIS: You signed in to your shopping account (${user.email}). If this was not you, change your password immediately.`,
      );
    } catch (_) {
      /* ignore */
    }
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    token: jwt,
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
  if (req.body.email) {
    const ev = validateShoppingEmail(req.body.email);
    if (!ev.ok) return res.status(400).json({ message: ev.message });
    user.email = ev.normalized;
  }
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
    token: jwt,
  });
}));

module.exports = router;
