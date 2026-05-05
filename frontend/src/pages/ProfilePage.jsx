import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    zip: user?.address?.zip || '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setError('');
    const data = { name: form.name, email: form.email, phone: form.phone, address: { street: form.street, city: form.city, zip: form.zip } };
    if (form.password) data.password = form.password;
    await updateUser(data);
  };

  return (
    <div className="container-custom py-10 animate-fade-in max-w-2xl">
      <h1 className="font-display text-3xl mb-8">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm
        px-4 py-3 border border-red-200">{error}</div>}
        <div className="grid sm:grid-cols-2 gap-4">
          {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'], ['street', 'Street Address', 'text'], ['city', 'City', 'text'], ['zip', 'Postal Code', 'text']].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field" />
            </div>
          ))}
        </div>
        <div className="border-t pt-5">
          <h3 className="font-medium mb-3 text-sm text-gray-500 uppercase
          tracking-wider">Change Password (leave blank to keep)</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Confirm Password</label><input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} className="input-field" /></div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}
