import { useEffect, useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiSearch, FiDownload, FiCreditCard } from 'react-icons/fi';
import { getAdminOrders } from '../../utils/api';
import toast from 'react-hot-toast';

function Spinner() {
  return <div className="w-8 h-8 rounded-full animate-spin mx-auto" style={{ border: '3px solid #fbbf24', borderTopColor: 'transparent' }} />;
}

export default function AdminTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    getAdminOrders({ limit: 100 })
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0);
  const paidCount = orders.filter(o => o.isPaid).length;
  const pendingCount = orders.filter(o => !o.isPaid && o.status !== 'cancelled').length;
  const cancelledRevenue = orders.filter(o => o.status === 'cancelled').reduce((s, o) => s + o.totalPrice, 0);

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'paid' ? o.isPaid :
      filter === 'pending' ? !o.isPaid && o.status !== 'cancelled' :
      filter === 'cancelled' ? o.status === 'cancelled' : true;
    return matchSearch && matchFilter;
  });

  // Monthly breakdown
  const monthlyData = {};
  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    const month = new Date(o.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, count: 0 };
    monthlyData[month].revenue += o.totalPrice;
    monthlyData[month].count += 1;
  });

  const paymentMethods = {};
  orders.forEach(o => {
    const m = o.paymentMethod || 'Unknown';
    paymentMethods[m] = (paymentMethods[m] || 0) + 1;
  });

  const exportCSV = () => {
    const rows = [
      ['Transaction ID', 'Customer', 'Email', 'Amount', 'Payment Method', 'Status', 'Date'],
      ...filtered.map(o => [
        o._id.slice(-10).toUpperCase(),
        o.user?.name || 'Guest',
        o.user?.email || '',
        o.totalPrice,
        o.paymentMethod,
        o.isPaid ? 'Paid' : 'Pending',
        new Date(o.createdAt).toLocaleDateString()
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-sm text-gray-400">All payment and revenue records</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <FiDownload size={15} /> Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: `PKR ${totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'bg-green-500', sub: `${orders.filter(o=>o.status!=='cancelled').length} orders` },
          { label: 'Paid Orders', value: paidCount, icon: FiTrendingUp, color: 'bg-blue-500', sub: 'Completed payments' },
          { label: 'Pending Payment', value: pendingCount, icon: FiCreditCard, color: 'bg-amber-400', sub: 'Awaiting payment' },
          { label: 'Cancelled Revenue', value: `PKR ${cancelledRevenue.toLocaleString()}`, icon: FiTrendingDown, color: 'bg-red-400', sub: 'Lost revenue' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
            </div>
            <p className="text-xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue + Payment Methods */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Monthly Revenue</h3>
          {Object.keys(monthlyData).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No transaction data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Month</th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Orders</th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Revenue</th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase">Avg Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Object.entries(monthlyData).map(([month, data]) => (
                    <tr key={month} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-700">{month}</td>
                      <td className="py-3 text-right text-gray-600">{data.count}</td>
                      <td className="py-3 text-right font-bold text-green-600">PKR {data.revenue.toLocaleString()}</td>
                      <td className="py-3 text-right text-gray-500">PKR {Math.round(data.revenue / data.count).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {Object.entries(paymentMethods).map(([method, count]) => {
              const pct = Math.round((count / orders.length) * 100) || 0;
              return (
                <div key={method}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-600">{method}</span>
                    <span className="text-gray-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(paymentMethods).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48 bg-gray-50">
            <FiSearch size={14} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="outline-none text-sm flex-1 bg-transparent placeholder-gray-400" />
          </div>
          <div className="flex gap-2">
            {['all', 'paid', 'pending', 'cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl capitalize transition-colors ${filter === f ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {loading ? <div className="py-20 flex justify-center"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Transaction ID', 'Customer', 'Method', 'Amount', 'Payment', 'Order Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-gray-400">No transactions found</td></tr>
                ) : filtered.map(order => (
                  <tr key={order._id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-gray-500">#{order._id.slice(-10).toUpperCase()}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-700">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{order.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-800">PKR {order.totalPrice?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
                        {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>{order.status}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
