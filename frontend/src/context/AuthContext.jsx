import { createContext, useContext, useEffect, useState } from 'react';
import {
  loginUser,
  registerUser,
  updateProfile,
  logoutUser,
  getProfile,
  setBearerToken,
  clearBearerToken,
} from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const LS_KEY = 'minis_user';

/** Persist display fields only; bearer JWT uses sessionStorage, not localStorage. */
function sanitizeStoredUser(u) {
  if (!u || typeof u !== 'object') return null;
  const { token: _discard, password: _p, ...safe } = u;
  return safe;
}

function migrateLegacyTokenFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    const t = p?.token;
    if (typeof t === 'string' && t.trim()) {
      setBearerToken(t);
      delete p.token;
      localStorage.setItem(LS_KEY, JSON.stringify(p));
    }
  } catch (_) {
    /* ignore */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    sanitizeStoredUser(JSON.parse(localStorage.getItem(LS_KEY) || 'null')),
  );
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const saveUser = (userData) => {
    const safe = sanitizeStoredUser(userData);
    setUser(safe);
    if (safe) localStorage.setItem(LS_KEY, JSON.stringify(safe));
    else localStorage.removeItem(LS_KEY);
  };

  useEffect(() => {
    migrateLegacyTokenFromLocalStorage();
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getProfile();
        if (!cancelled) saveUser(data);
      } catch {
        if (!cancelled) {
          setUser(null);
          localStorage.removeItem(LS_KEY);
          clearBearerToken();
        }
      } finally {
        if (!cancelled) setSessionChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });
      if (data.token) setBearerToken(data.token);
      saveUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, phone, phoneOtp }) => {
    const body = {
      name,
      email,
      password,
      phone,
      ...(phoneOtp != null && String(phoneOtp).trim()
        ? { phoneOtp: String(phoneOtp).trim() }
        : {}),
    };

    setLoading(true);
    try {
      const { data } = await registerUser(body);
      toast.success(data.message || 'Check your email to verify your account.');
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      const serverErrors = err.response?.data?.errors;
      toast.error(msg);
      return {
        ok: false,
        errors: typeof serverErrors === 'object' && serverErrors !== null ? serverErrors : undefined,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    clearBearerToken();
    try {
      await logoutUser();
    } catch (_) {
      // Cookie may already be cleared; finish local teardown anyway.
    }
    saveUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const { data: updated } = await updateProfile(data);
      if (updated.token) setBearerToken(updated.token);
      saveUser(updated);
      toast.success('Profile updated!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, sessionChecked, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
