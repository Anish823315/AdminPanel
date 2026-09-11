import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = ({ title, subtitle, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 40
          }}
        />
      )}

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>

            <div className="topbar-heading">
              <span className="eyebrow">Admin Panel</span>
              <h2>{title}</h2>
              {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
            </div>
          </div>

          <div className="admin-name">
            {admin?.name || 'Administrator'}
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;