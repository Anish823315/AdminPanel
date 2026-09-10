import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = ({ title, children }) => {
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
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h2>{title}</h2>

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