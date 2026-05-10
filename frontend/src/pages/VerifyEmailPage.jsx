import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  verifyEmail,
  verifyEmailOtp,
  resendEmailVerification,
  getRegisterOptions,
} from '../utils/api';

/** Link-in-email verification (automatic). */
function LinkVerifier({ token, emailNorm }) {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await verifyEmail({ token, email: emailNorm });
        if (!cancelled) {
          setStatus('ok');
          setMessage(data.message || 'Your email has been verified.');
          toast.success('Email verified');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err.response?.data?.message || 'Verification failed.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, emailNorm]);

  return (
    <>
      {status === 'loading' && (
        <p className="text-gray-600 text-sm mt-4">Opening your magic link…</p>
      )}
      {status !== 'loading' && (
        <div
          className={`text-sm px-4 py-3 border rounded-lg text-left mt-4 ${
            status === 'ok'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
}

/** Manual 6-digit OTP from email. */
function OtpForm({ emailParam, redirect, cooldownSecDefault }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendSecs, setResendSecs] = useState(0);
  const [sending, setSending] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(cooldownSecDefault);

  useEffect(() => {
    setEmail(emailParam);
  }, [emailParam]);

  useEffect(() => {
    let alive = true;
    getRegisterOptions()
      .then(({ data }) => {
        if (!alive || !data) return;
        const c = Number(data.emailOtpResendCooldownSeconds);
        if (Number.isFinite(c) && c > 0) setCooldownSec(c);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (resendSecs <= 0) return undefined;
    const t = window.setTimeout(() => setResendSecs((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [resendSecs]);

  const loginHref =
    redirect && redirect !== '/'
      ? `/login?redirect=${encodeURIComponent(redirect)}`
      : '/login';

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    const digits = code.replace(/\D/g, '');
    if (!trimmed) {
      toast.error('Enter your email');
      return;
    }
    if (!/^[0-9]{6}$/.test(digits)) {
      toast.error('Enter the 6-digit code from your email');
      return;
    }
    setSubmitting(true);
    try {
      await verifyEmailOtp({ email: trimmed, code: digits });
      toast.success('Email verified');
      navigate(loginHref);
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      toast.error('Enter your email first');
      return;
    }
    setSending(true);
    try {
      await resendEmailVerification({ email: trimmed });
      toast.success('Check your inbox for a new code');
      setResendSecs(cooldownSec);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        status === 429
          ? 'Please wait before requesting another email'
          : err.response?.data?.message || 'Could not resend email';
      toast.error(msg);
      if (status === 429) setResendSecs(cooldownSec);
    } finally {
      setSending(false);
    }
  };

  const resendBlocked = resendSecs > 0 || sending;

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 text-left max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">6-digit code from email</label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          className="input-field tracking-widest text-center text-lg"
          placeholder="000000"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="btn-dark w-full disabled:opacity-50"
      >
        {submitting ? 'Checking…' : 'Verify email'}
      </button>
      <button
        type="button"
        disabled={resendBlocked}
        onClick={resend}
        className="w-full py-2.5 text-sm border border-dark/15 rounded hover:bg-dark/5 disabled:opacity-50"
      >
        {resendSecs > 0 ? `Resend email (${resendSecs}s)` : 'Email new code'}
      </button>
    </form>
  );
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailFromQuery = (searchParams.get('email') || '').trim();
  const emailNorm = emailFromQuery.toLowerCase();
  const redirect = searchParams.get('redirect') || '/';

  const isLinkFlow = Boolean(token && emailNorm);
  const incompleteMagicLink = Boolean(token) && !emailNorm;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 animate-fade-in">
      <div className="w-full max-w-md px-6 text-center">
        <h1 className="font-display text-3xl text-dark mb-4">Verify your email</h1>
        <p className="text-gray-500 text-xs max-w-sm mx-auto">
          Open the message we sent you: enter the{' '}
          <strong className="text-dark">6-digit code</strong> below, or use the{' '}
          <strong className="text-dark">verification link</strong>{' '}
          in that email. A phone SMS code during sign-up is only for your mobile number.
        </p>

        {incompleteMagicLink && (
          <p className="text-amber-800 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-4">
            This link is missing your email—you can verify by entering your email and the code below.
          </p>
        )}

        {isLinkFlow && <LinkVerifier token={token} emailNorm={emailNorm} />}

        {!isLinkFlow && (
          <OtpForm emailParam={emailFromQuery} redirect={redirect} cooldownSecDefault={55} />
        )}

        {isLinkFlow && (
          <p className="text-gray-500 text-xs mt-6">
            You can{' '}
            <Link
              className="text-primary-600 hover:underline"
              to={`/verify-email?email=${encodeURIComponent(emailNorm)}`}
            >
              enter the code here
            </Link>{' '}
            without using the button in the email.
          </p>
        )}

        <div className="mt-8 space-y-2 text-sm">
          <Link
            to={
              redirect && redirect !== '/'
                ? `/login?redirect=${encodeURIComponent(redirect)}`
                : '/login'
            }
            className="text-primary-600 font-medium hover:underline block"
          >
            Sign in
          </Link>
          <Link to="/register" className="text-gray-500 hover:underline block">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
