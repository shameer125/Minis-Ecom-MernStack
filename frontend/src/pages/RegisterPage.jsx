import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const initialErrors = () => ({ name: '', email: '', password: '', phone: '' });

function validateFrontend({ name, email, password, phone }) {
  const errors = initialErrors();

  const n = name.trim();
  if (!n) errors.name = 'Name is required';
  else if (!/^[A-Za-z\s]+$/.test(n)) errors.name = 'Name may only contain letters and spaces';

  const em = email.trim().toLowerCase();
  if (!em) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) errors.email = 'Enter a valid email address';

  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters';

  const ph = phone.trim();
  if (!ph) errors.phone = 'Phone is required';
  else if (!/^[0-9]+$/.test(ph)) errors.phone = 'Phone must contain only numbers';

  return errors;
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState(initialErrors());
  const [showPw, setShowPw] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateFrontend(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const result = await register(
      form.name.trim(),
      form.email.trim(),
      form.password,
      form.phone.trim(),
    );
    if (!result.ok) {
      if (result.errors)
        setErrors((prev) => ({ ...prev, ...result.errors }));
      return;
    }
    navigate(`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center
    py-12 animate-fade-in">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-dark mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join MINIS for exclusive offers</p>
        </div>
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
              className="input-field"
              placeholder="digits only"
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>
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
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
