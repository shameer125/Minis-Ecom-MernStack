import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiShoppingBag, FiPackage, FiUsers, FiLogOut, FiExternalLink, FiTruck, FiCreditCard, FiSettings } from 'react-icons/fi';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiShoppingBag },
  { to: '/admin/users', label: 'Customers', icon: FiUsers },
  { to: '/admin/orders', label: 'Orders', icon: FiPackage },
  { to: '/admin/shipments', label: 'Shipments', icon: FiTruck },
  { to: '/admin/transactions', label: 'Transactions', icon: FiCreditCard },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f8fb' }}>
      <aside className="w-52 shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-sm">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shadow-sm">
              <FiShoppingBag size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-base tracking-tight">MINIS</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? 'bg-amber-400 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`
              }>
              <Icon size={17} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
            <FiExternalLink size={16} /><span>View Store</span>
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <FiLogOut size={16} /><span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
