/** Mirrors backend rules for instant feedback; server still validates. */
const BLOCKED_LOCAL = new Set([
  'test', 'testing', 'admin', 'invalid', 'none', 'null', 'user', 'demo',
  'noreply', 'no-reply', 'guest', 'sample', 'example', 'fake', 'junk', 'spam', 'qwerty', 'asd',
]);

const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', 'sharklasers.com', 'tempmail.com',
  'dispostable.com', 'maildrop.cc', 'yopmail.com', 'getnada.com', 'fakeinbox.com',
  'trashmail.com', '10minutemail.com', 'throwaway.email', 'temp-mail.org', 'mail.tm',
]);

const BASIC_EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export function validateShopEmailClient(raw) {
  const e = String(raw || '').trim().toLowerCase();
  if (!e) return { ok: false, message: 'Email is required' };
  if (!BASIC_EMAIL.test(e)) return { ok: false, message: 'Enter a valid email address' };
  const [local, domain] = e.split('@');
  if (!local || !domain) return { ok: false, message: 'Enter a valid email address' };
  if (BLOCKED_LOCAL.has(local)) {
    return { ok: false, message: 'This email address cannot be used for registration' };
  }
  if (DISPOSABLE.has(domain)) {
    return { ok: false, message: 'Disposable or burner email addresses are not allowed' };
  }
  return { ok: true };
}
