import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser, updateProfile } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('minis_user') || 'null'));
  const [loading, setLoading] = useState(false);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('minis_user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });
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

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await registerUser({ name, email, password, phone });
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('minis_user');
    toast.success('Logged out successfully');
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const { data: updated } = await updateProfile(data);
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
