import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRegisterOptions, sendRegisterPhoneCode } from '../utils/api';
import { validateShopEmailClient } from '../utils/validateShopEmail';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const initialErrors = () => ({
  name: '',
  email: '',
  password: '',
  phone: '',
  phoneOtp: '',
});

function validateFrontend(
  { name, email, password, phone, phoneOtp },
  { phoneVerificationRequired },
) {
  const errors = initialErrors();

  const n = name.trim();
  if (!n) errors.name = 'Name is required';
  else if (!/^[A-Za-z\s]+$/.test(n))
    errors.name = 'Name may only contain letters and spaces';

  const ev = validateShopEmailClient(email);
  if (!ev.ok) errors.email = ev.message;

  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters';

  const ph = phone.trim();
  if (!ph) errors.phone = 'Phone is required';
  else if (!/^[0-9]+$/.test(ph)) errors.phone = 'Phone must contain only numbers';
  else if (ph.length < 10) errors.phone = 'Enter a complete phone number (at least 10 digits)';

  if (phoneVerificationRequired) {
    const code = phoneOtp.trim();
    if (!/^[0-9]{6}$/.test(code)) {
      errors.phoneOtp = 'Enter the 6-digit code sent to your phone';
    }
  }

  return errors;
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    phoneOtp: '',
  });
  const [errors, setErrors] = useState(initialErrors());
  const [showPw, setShowPw] = useState(false);
  const [phoneVerificationRequired, setPhoneVerificationRequired] = useState(false);
  const [emailDeliveryConfigured, setEmailDeliveryConfigured] = useState(null);
  const [smsCooldownSec, setSmsCooldownSec] = useState(55);
  const [resendSecs, setResendSecs] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    let alive = true;
    getRegisterOptions()
      .then(({ data }) => {
        if (!alive || !data) return;
        setPhoneVerificationRequired(Boolean(data.phoneVerificationRequired));
        if (typeof data.emailDeliveryConfigured === 'boolean') {
          setEmailDeliveryConfigured(data.emailDeliveryConfigured);
        }
        const c = Number(data.smsResendCooldownSeconds);
        setSmsCooldownSec(Number.isFinite(c) && c > 0 ? c : 55);
      })
      .catch(() => {
        /* optional; behaves as email-only signup */
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (resendSecs <= 0) return undefined;
    const t = window.setTimeout(() => setResendSecs((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [resendSecs]);

  const handleSendCode = async () => {
    const ph = form.phone.trim();
    if (!/^[0-9]+$/.test(ph) || ph.length < 10) {
      setErrors((e) => ({ ...e, phone: 'Enter a complete phone number (at least 10 digits)' }));
      toast.error('Enter a valid phone number before requesting a code');
      return;
    }
    setSendingCode(true);
    try {
      await sendRegisterPhoneCode({ phone: ph });
      toast.success('Code sent — check your phone');
      setResendSecs(smsCooldownSec);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        status === 429
          ? 'Please wait before requesting another code'
          : err.response?.data?.message || 'Could not send SMS';
      toast.error(msg);
      if (status === 429) setResendSecs(smsCooldownSec);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateFrontend(form, { phoneVerificationRequired });
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      ...(phoneVerificationRequired ? { phoneOtp: form.phoneOtp.trim() } : {}),
    });
    if (!result.ok) {
      if (result.errors) setErrors((prev) => ({ ...prev, ...result.errors }));
      return;
    }
    const verifyQs = new URLSearchParams();
    verifyQs.set('email', form.email.trim());
    if (redirect !== '/') verifyQs.set('redirect', redirect);
    navigate(`/verify-email?${verifyQs.toString()}`);
  };

  const canSendCode =
    !sendingCode && resendSecs <= 0 && /^[0-9]+$/.test(form.phone.trim()) && form.phone.trim().length >= 10;

  return (
    <div className="min-h-[80vh] flex items-center justify-center
    py-12 animate-fade-in">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-dark mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join MINIS for exclusive offers</p>
        </div>
        {emailDeliveryConfigured === false && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Mail is not wired on the API. Add Gmail{' '}
            <span className="font-mono">EMAIL_USER</span> and{' '}
            <span className="font-mono">EMAIL_PASS</span> (Google App Password) — see{' '}
            <span className="font-mono">backend/.env.example</span>. Set{' '}
            <span className="font-mono">API_PUBLIC_URL</span> so the link in the email points at this
            server (e.g. http://localhost:5000).
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
              placeholder="Jane Doe"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="input-field"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            <p className="text-xs text-gray-500 mt-1">
              After sign-up you’ll receive a <strong className="text-dark font-medium">6-digit email code</strong> and an optional link—not via SMS—plus an SMS signup code only if phone verification is on.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  phone: e.target.value.replace(/\D/g, ''),
                  phoneOtp: '',
                }))
              }
              className="input-field"
              placeholder="digits only — we may text you a signup code"
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>
          {phoneVerificationRequired && (
            <>
              <button
                type="button"
                disabled={!canSendCode}
                onClick={handleSendCode}
                className="btn-dark w-full disabled:opacity-50 text-sm py-2.5"
              >
                {sendingCode
                  ? 'Sending…'
                  : resendSecs > 0
                    ? `Resend code in ${resendSecs}s`
                    : 'Send SMS code'}
              </button>
              <div>
                <label className="block text-sm font-medium mb-1">SMS verification code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={form.phoneOtp}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phoneOtp: e.target.value.replace(/\D/g, '') }))
                  }
                  className="input-field tracking-widest"
                  placeholder="6-digit code"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Request a phone code, enter it above, then complete email verification after sign-up with the emailed 6-digit code (or link).
                </p>
                {errors.phoneOtp && (
                  <p className="text-red-600 text-xs mt-1">{errors.phoneOtp}</p>
                )}
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input-field pr-10"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-dark w-full disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
