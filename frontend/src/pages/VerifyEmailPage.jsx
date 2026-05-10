import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../utils/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage('This verification link is invalid or incomplete.');
        return;
      }
      try {
        const { data } = await verifyEmail({ token, email });
        if (!cancelled) {
          setStatus('ok');
          setMessage(data.message || 'Your email has been verified.');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err.response?.data?.message || 'Verification failed.');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token, email]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 animate-fade-in">
      <div className="w-full max-w-md px-6 text-center">
        <h1 className="font-display text-3xl text-dark mb-4">Email verification</h1>
        {status === 'loading' && (
          <p className="text-gray-600 text-sm">Verifying your email…</p>
        )}
        {status !== 'loading' && (
          <div
            className={`text-sm px-4 py-3 border rounded-lg ${
              status === 'ok'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {message}
          </div>
        )}
        <div className="mt-8 space-y-2 text-sm">
          <Link to="/login" className="text-primary-600 font-medium hover:underline block">
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
