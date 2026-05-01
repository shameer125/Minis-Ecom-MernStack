import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingCart, FiUsers, FiPackage, FiTrendingUp,
  FiArrowRight, FiMoreVertical, FiSliders, FiBell, FiSearch
} from 'react-icons/fi';
import { getAdminStats } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function CircleProgress({ percent, color, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={6} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

function StatMiniCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const monthEntries = stats ? Object.entries(stats.monthlyRevenue) : [];
  const maxRev = Math.max(...monthEntries.map(([, v]) => v), 1);

  // Fill up to 12 months display
  const allMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthMap = Object.fromEntries(monthEntries);
  const barData = allMonths.map(m => {
    const key = Object.keys(monthMap).find(k => k.startsWith(m)) || null;
    return { month: m, value: key ? monthMap[key] : 0 };
  });

  const categoryStats = [
    { label: 'Women', percent: 63, color: '#f59e0b' },
    { label: 'Men', percent: 88, color: '#ef4444' },
    { label: 'Kids', percent: 38, color: '#8b5cf6' },
  ];

  const customerCircles = stats ? [
    { label: 'Current Customers', percent: 85, color: '#8b5cf6' },
    { label: 'New Customers', percent: 66, color: '#f59e0b' },
    { label: 'Target Customers', percent: 90, color: '#f59e0b' },
    { label: 'Retarget Customers', percent: 30, color: '#ef4444' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#f8f8fb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back, {user?.name} 👋</p>
        </div>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 shadow-sm">
            <FiSearch size={15} className="text-gray-400" />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search..."
              className="outline-none text-sm flex-1 bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
            <FiMoreVertical size={16} className="text-gray-500" />
          </button>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors relative">
            <FiBell size={16} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-5">

          {/* ── Revenue Chart ── */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  PKR {stats?.totalRevenue?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                <span className="text-xs font-semibold text-amber-600">THIS YEAR</span>
                <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="#d97706" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-2 mt-6 h-44">
              {barData.map(({ month, value }) => {
                const heightPct = maxRev > 0 ? (value / maxRev) * 100 : 0;
                const isActive = heightPct > 60;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex flex-col justify-end" style={{ height: '152px' }}>
                      <div
                        className="w-full rounded-t-md relative group cursor-pointer transition-all duration-500"
                        style={{
                          height: `${Math.max(heightPct, 4)}%`,
                          background: isActive
                            ? 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)'
                            : '#f0f0f0',
                          minHeight: '6px'
                        }}
                      >
                        {value > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            PKR {Math.round(value/1000)}k
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Customer Circles ── */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-base font-bold text-gray-800">Customers</p>
                <p className="text-xs text-gray-400">Information About your Customers</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <FiSliders size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5">
              {customerCircles.map(({ label, percent, color }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <CircleProgress percent={percent} color={color} size={80} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{percent}<span className="text-xs">%</span></span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Mini Stat Cards + Top Products ── */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* 4 mini stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatMiniCard icon={FiUsers} label="Total Visits" value={`${((stats?.totalUsers || 0) * 5.4).toFixed(1)}k`} color="bg-amber-400" />
              <StatMiniCard icon={FiShoppingCart} label="Total Sales" value={(stats?.totalOrders || 0).toLocaleString()} color="bg-amber-500" />
              <StatMiniCard icon={FiTrendingUp} label="Total Revenue" value={`PKR ${Math.round((stats?.totalRevenue||0)/1000)}k`} color="bg-orange-400" />
              <StatMiniCard icon={FiPackage} label="Orders Done" value={stats?.ordersByStatus?.delivered || 0} color="bg-red-400" />
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <p className="font-bold text-gray-800">Top Products</p>
                <Link to="/admin/products" className="text-xs text-amber-500 hover:text-amber-600 font-medium flex items-center gap-1">
                  View All <FiArrowRight size={12} />
                </Link>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Inventory</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sale</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats?.recentOrders?.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No data yet — seed your database</td></tr>
                  ) : (
                    stats?.recentOrders?.slice(0, 5).map((order, i) => {
                      const item = order.orderItems?.[0];
                      return item ? (
                        <tr key={order._id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {item.image
                                ? <img src={item.image} alt={item.name} className="w-9 h-11 object-cover rounded-lg bg-gray-100 shrink-0" />
                                : <div className="w-9 h-11 bg-amber-100 rounded-lg shrink-0 flex items-center justify-center text-amber-400 text-xs font-bold">{item.name?.[0]}</div>
                              }
                              <div>
                                <p className="font-semibold text-gray-700 text-xs line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.color || 'N/A'} · {item.quantity} orders</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className="font-bold text-gray-700">{item.quantity * 10}</span>
                          </td>
                          <td className="px-3 py-3 text-center text-gray-500">PKR {item.price?.toLocaleString()}</td>
                          <td className="px-3 py-3 text-center font-semibold text-gray-700">PKR {(item.price * item.quantity)?.toLocaleString()}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ) : null;
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Stats Overview (category bars) ── */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-base font-bold text-gray-800">Stats Overview</p>
                <p className="text-xs text-gray-400">Information about store visits</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><FiSliders size={16} /></button>
            </div>

            <div className="mt-6 space-y-5">
              {categoryStats.map(({ label, percent, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-600">{label}</span>
                    <span className="text-sm font-bold text-gray-700">{percent}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${percent}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Order status summary */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Summary</p>
              {stats && Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'delivered' ? 'bg-green-400' :
                      status === 'pending' ? 'bg-yellow-400' :
                      status === 'processing' ? 'bg-blue-400' :
                      status === 'shipped' ? 'bg-purple-400' : 'bg-red-400'
                    }`} />
                    <span className="text-xs text-gray-500 capitalize">{status}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
