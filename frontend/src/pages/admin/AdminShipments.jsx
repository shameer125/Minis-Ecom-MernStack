import { useEffect, useState } from 'react';
import { FiTruck, FiSearch, FiMapPin, FiPackage, FiCheck, FiClock } from 'react-icons/fi';
import { getAdminOrders, updateAdminOrderStatus } from '../../utils/api';
import toast from 'react-hot-toast';

const SHIPMENT_STATUSES = ['processing', 'shipped', 'delivered'];

const statusConfig = {
  pending:    { color: 'bg-yellow-100 text-yellow-700', icon: FiClock,   label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-700',    icon: FiPackage,  label: 'Packing' },
  shipped:    { color: 'bg-purple-100 text-purple-700',icon: FiTruck,    label: 'Shipped' },
  delivered:  { color: 'bg-green-100 text-green-700',  icon: FiCheck,    label: 'Delivered' },
  cancelled:  { color: 'bg-red-100 text-red-600',      icon: FiClock,    label: 'Cancelled' },
};

function Spinner() {
  return <div className="w-8 h-8 rounded-full animate-spin mx-auto" style={{ border: '3px solid #fbbf24', borderTopColor: 'transparent' }} />;
}

export default function AdminShipments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    getAdminOrders({ limit: 50, status: filter })
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('Failed to load shipments'))
      .finally(() => setLoading(false));
  }, [filter]);

  const filtered = orders.filter(o =>
    !search ||
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingAddress?.city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatus = async (id, status) => {
    try {
      await updateAdminOrderStatus(id, status);
      toast.success(`Shipment marked as ${status}`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch { toast.error('Update failed'); }
  };

  const stats = {
    total: orders.length,
    packing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shipments</h1>
        <p className="text-sm text-gray-400">Track and manage all order shipments</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Shipments', value: stats.total, icon: FiPackage, color: 'bg-blue-500' },
          { label: 'Packing', value: stats.packing, icon: FiPackage, color: 'bg-amber-400' },
          { label: 'In Transit', value: stats.shipped, icon: FiTruck, color: 'bg-purple-500' },
          { label: 'Delivered', value: stats.delivered, icon: FiCheck, color: 'bg-green-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48 bg-gray-50">
          <FiSearch size={14} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer or city..."
            className="outline-none text-sm flex-1 bg-transparent placeholder-gray-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'processing', 'shipped', 'delivered'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl capitalize transition-colors ${filter === s ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="py-20 flex justify-center"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Tracking ID', 'Customer', 'Destination', 'Items', 'Value', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                    <FiTruck size={32} className="mx-auto mb-2 text-gray-200" />No shipments found
                  </td></tr>
                ) : filtered.map(order => {
                  const cfg = statusConfig[order.status] || statusConfig.pending;
                  const Icon = cfg.icon;
                  return (
                    <tr key={order._id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-bold text-gray-600">#{order._id.slice(-10).toUpperCase()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-700">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-1.5">
                          <FiMapPin size={13} className="text-primary-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">{order.shippingAddress?.city}</p>
                            <p className="text-xs text-gray-400">{order.shippingAddress?.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 font-medium">{order.orderItems?.length}</td>
                      <td className="px-5 py-4 font-bold text-gray-800">PKR {order.totalPrice?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold w-fit ${cfg.color}`}>
                          <Icon size={11} />{cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <select value={order.status} onChange={e => handleStatus(order._id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-amber-400 bg-gray-50 text-gray-700">
                          {['pending','processing','shipped','delivered','cancelled'].map(s => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
