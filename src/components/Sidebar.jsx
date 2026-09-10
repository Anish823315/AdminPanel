import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Settings,
  LayoutDashboard,
  Users,
  ReceiptText,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ open, onClose }) => {
  const { logout } = useAuth();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <Settings size={20} />
        <span>Admin Panel</span>
      </div>

      <nav>
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/users"
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <Users size={18} />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/orders"
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <ReceiptText size={18} />
          <span>Orders</span>
        </NavLink>

        <button onClick={logout} style={{ marginTop: 12 }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;