import { useEffect, useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiX, FiShield, FiUsers } from 'react-icons/fi';
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function Spinner() {
  return <div className="w-8 h-8 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" style={{border:'3px solid',borderTopColor:'transparent',borderRadius:'50%'}} />;
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', isAdmin: false });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUsers({ page, limit: 15, search });
      setUsers(data.users); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400); return () => clearTimeout(t); }, [search]);

  const openEdit = (u) => { setEditUser(u); setEditForm({ name: u.name, email: u.email, isAdmin: u.isAdmin }); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await updateAdminUser(editUser._id, editForm); toast.success('User updated!'); setEditUser(null); fetchUsers(); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteAdminUser(id); toast.success('User deleted'); setDeleteConfirm(null); fetchUsers(); }
    catch { toast.error('Delete failed'); }
  };

  const avatarColors = ['bg-amber-400','bg-blue-400','bg-purple-400','bg-green-400','bg-pink-400','bg-red-400'];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-400">{total} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 max-w-sm bg-gray-50">
          <FiSearch size={14} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="outline-none text-sm flex-1 bg-transparent text-gray-700 placeholder-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['User','Role','Phone','Location','Joined','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                    <FiUsers size={32} className="mx-auto mb-2 text-gray-200" />No users found
                  </td></tr>
                ) : users.map((u, idx) => (
                  <tr key={u._id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold w-fit ${u.isAdmin ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                        {u.isAdmin && <FiShield size={10} />}{u.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{u.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{u.address?.city || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(u)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={14} /></button>
                        {u._id !== currentUser._id && (
                          <button onClick={() => setDeleteConfirm(u._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${p === page ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl">
              <h2 className="font-bold text-lg text-gray-800">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[['Full Name','name','text'],['Email Address','email','email']].map(([label,key,type]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">{label}</label>
                  <input required type={type} value={editForm[key]} onChange={e => setEditForm(f => ({...f,[key]:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 bg-gray-50" />
                </div>
              ))}
              <div onClick={() => setEditForm(f => ({...f,isAdmin:!f.isAdmin}))}
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${editForm.isAdmin ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${editForm.isAdmin ? 'bg-amber-400' : 'bg-gray-100'}`}>
                    <FiShield size={16} className={editForm.isAdmin ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Admin Access</p>
                    <p className="text-xs text-gray-400">Full admin panel access</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${editForm.isAdmin ? 'bg-amber-400' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${editForm.isAdmin ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="submit" disabled={saving} className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditUser(null)} className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 size={20} className="text-red-500" /></div>
            <h3 className="font-bold text-lg text-center mb-1">Delete User?</h3>
            <p className="text-sm text-gray-400 text-center mb-5">All data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
