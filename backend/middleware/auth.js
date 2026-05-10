const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'minis_auth';

const COOKIE_MAX_AGE_MS =
  Number(process.env.JWT_COOKIE_MS) >= 5000 ? Number(process.env.JWT_COOKIE_MS) : 30 * 24 * 60 * 60 * 1000;

function isProductionEnv() {
  return process.env.NODE_ENV === 'production';
}

/** Secure cookies in production unless COOKIE_SECURE is explicitly overridden. */
function cookieSecureFlag() {
  const raw = process.env.COOKIE_SECURE;
  if (raw !== undefined && String(raw).trim() !== '') {
    return String(raw).toLowerCase() === 'true';
  }
  return isProductionEnv();
}

/**
 * JWT lives in HttpOnly cookie; Cookie + CORS defaults must align with your frontend host.
 * - COOKIE_SAMESITE: lax | strict | none (optional)
 * - If secure is true and SameSite omitted, SameSite defaults to none (common for cross-domain APIs).
 */
function getAuthCookieBaseOptions() {
  const secure = cookieSecureFlag();
  const explicitSameSite = (process.env.COOKIE_SAMESITE || '').trim().toLowerCase();
  let sameSite = 'lax';
  if (explicitSameSite === 'strict' || explicitSameSite === 'lax' || explicitSameSite === 'none') {
    sameSite = explicitSameSite;
  } else if (secure) {
    sameSite = 'none';
  }

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: COOKIE_MAX_AGE_MS,
  };
}

function setAuthCookie(res, token) {
  res.cookie(JWT_COOKIE_NAME, token, getAuthCookieBaseOptions());
}

function clearAuthCookie(res) {
  const o = getAuthCookieBaseOptions();
  res.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: o.httpOnly,
    secure: o.secure,
    sameSite: o.sameSite,
    path: o.path,
  });
}

const protect = async (req, res, next) => {
  let token = req.cookies?.[JWT_COOKIE_NAME];
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    if (!req.user.isAdmin && req.user.isVerified === false) {
      return res.status(403).json({ message: 'Please verify your email to access this resource' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: Math.floor(COOKIE_MAX_AGE_MS / 1000),
  });
};

module.exports = {
  protect,
  admin,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
};
