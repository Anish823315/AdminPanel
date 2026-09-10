import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout.jsx';
import Pagination from '../components/Pagination.jsx';
import api from '../api/axios';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Completed'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/orders', {
        params: { search, status: statusFilter, page, limit: 8 },
      });
      setOrders(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  const handleStatusChange = async (order, newStatus) => {
    setUpdatingId(order._id);
    try {
      await api.patch(`/orders/${order._id}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: newStatus } : o)));
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Layout title="Order Management">
      <div className="panel">
        <div className="panel-header">
          <div className="toolbar">
            <input
              className="search-input"
              placeholder="Search order #, customer, product..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select
              className="status-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading && <div className="loading-state">Loading orders...</div>}
        {error && <div className="error-text">{error}</div>}

        {!loading && !error && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{o.orderNumber}</td>
                      <td>{o.customerName}</td>
                      <td>{o.product}</td>
                      <td>${o.amount.toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={o.status}
                          disabled={updatingId === o._id}
                          onChange={(e) => handleStatusChange(o, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && <div className="empty-state">No orders found.</div>}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
