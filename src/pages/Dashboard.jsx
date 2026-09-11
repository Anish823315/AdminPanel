import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import api from '../api/axios';
import {
  Users,
  UserCheck,
  ReceiptText,
  WalletCards,
  Clock3,
  Settings2,
  CircleCheck,
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, iconClass }) => (
  <div className="stat-card group">
    <div className={`icon ${iconClass}`}>
      <Icon size={22} strokeWidth={2} />
    </div>

    <div className="label">{label}</div>

    <div className="value">{value}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.data);
      } catch (err) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout title="Dashboard" subtitle="Overview of your platform's performance">
      {loading && <div className="loading-state">Loading dashboard...</div>}
      {error && <div className="error-text">{error}</div>}

      {stats && (
        <>
          <div className="stats-grid">
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              icon={Users}
              iconClass="icon-blue"
            />

            <StatCard
              label="Active Users"
              value={stats.activeUsers}
              icon={UserCheck}
              iconClass="icon-green"
            />

            <StatCard
              label="Total Orders"
              value={stats.totalOrders}
              icon={ReceiptText}
              iconClass="icon-orange"
            />

            <StatCard
              label="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
              icon={WalletCards}
              iconClass="icon-purple"
            />
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3 style={{ margin: 0 }}>Order Status Breakdown</h3>
            </div>

            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <StatCard
                label="Pending"
                value={stats.orderStatusBreakdown.Pending}
                icon={Clock3}
                iconClass="icon-orange"
              />

              <StatCard
                label="Processing"
                value={stats.orderStatusBreakdown.Processing}
                icon={Settings2}
                iconClass="icon-blue"
              />

              <StatCard
                label="Completed"
                value={stats.orderStatusBreakdown.Completed}
                icon={CircleCheck}
                iconClass="icon-green"
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;