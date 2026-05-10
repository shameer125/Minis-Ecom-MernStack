const validator = require('validator');

/** Local parts blocked for storefront sign‑ups (e.g. test@gmail.com looks like junk). Extend via env comma list: BLOCK_EMAIL_LOCAL_PARTS */
const BLOCKED_LOCAL_PARTS = new Set([
  'test',
  'testing',
  'admin',
  'invalid',
  'none',
  'null',
  'user',
  'demo',
  'noreply',
  'no-reply',
  'guest',
  'sample',
  'example',
  'fake',
  'junk',
  'spam',
  'qwerty',
  'asd',
]);

/** Common disposable / burner domains. Extend via env BLOCK_EMAIL_DOMAINS=foo.com,bar.com */
const DEFAULT_THROWAWAY_DOMAINS = [
  'mailinator.com',
  'guerrillamail.com',
  'sharklasers.com',
  'tempmail.com',
  'dispostable.com',
  'maildrop.cc',
  'yopmail.com',
  'getnada.com',
  'fakeinbox.com',
  'trashmail.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'mail.tm',
];

function blockedLocalExtras() {
  return (process.env.BLOCK_EMAIL_LOCAL_PARTS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function throwawayExtras() {
  return (process.env.BLOCK_EMAIL_DOMAINS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

const blockedLocals = () => {
  const s = new Set(BLOCKED_LOCAL_PARTS);
  blockedLocalExtras().forEach((p) => s.add(p));
  return s;
};

const throwawayDomains = () => {
  const s = new Set(DEFAULT_THROWAWAY_DOMAINS.map((d) => d.toLowerCase()));
  throwawayExtras().forEach((d) => s.add(d));
  return s;
};

/**
 * @returns {{ ok: true, normalized: string } | { ok: false, message: string }}
 */
function validateShoppingEmail(raw) {
  const trimmed = typeof raw === 'string' ? raw.trim().toLowerCase() : '';

  const locals = blockedLocals();
  const throwaways = throwawayDomains();

  if (!validator.isEmail(trimmed, { allow_utf8_local_part: false })) {
    return { ok: false, message: 'Enter a valid email address' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) return { ok: false, message: 'Enter a valid email address' };
  const local = parts[0].toLowerCase();
  const domain = parts[1].toLowerCase();

  if (!local || local.length > 64) return { ok: false, message: 'Enter a valid email address' };
  if (locals.has(local))
    return { ok: false, message: 'This email address cannot be used for registration' };
  if (throwaways.has(domain))
    return { ok: false, message: 'Disposable or burner email addresses are not allowed' };

  return { ok: true, normalized: trimmed };
}

module.exports = { validateShoppingEmail };
