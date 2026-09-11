import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout.jsx';
import Pagination from '../components/Pagination.jsx';
import UserFormModal from '../components/UserFormModal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import api from '../api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/users', {
        params: { search, status: statusFilter, page, limit: 8 },
      });
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300); // debounce search
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, form);
      } else {
        await api.post('/users', form);
      }
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/users/${user._id}/status`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <Layout title="User Management" subtitle="Add, edit, and manage system users">
      <div className="panel">
        <div className="panel-header">
          <div className="toolbar">
            <input
              className="search-input"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select
              className="status-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowForm(true); }}>
            + Add User
          </button>
        </div>

        {loading && <div className="loading-state">Loading users...</div>}
        {error && <div className="error-text">{error}</div>}

        {!loading && !error && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td data-label="Name">{u.name}</td>
                      <td data-label="Email">{u.email}</td>
                      <td data-label="Phone">{u.phone || '-'}</td>
                      <td data-label="Role" style={{ textTransform: 'capitalize' }}>{u.role}</td>
                      <td data-label="Status">
                        <button
                          className={`badge badge-${u.status}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                          onClick={() => handleToggleStatus(u)}
                          title="Click to toggle status"
                        >
                          {u.status}
                        </button>
                      </td>
                      <td data-label="Actions">
                        <div className="row-actions">
                          <button className="icon-btn" title="Edit" onClick={() => { setEditingUser(u); setShowForm(true); }}>✏️</button>
                          <button className="icon-btn danger" title="Delete" onClick={() => setDeleteTarget(u)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && <div className="empty-state">No users found.</div>}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      {showForm && (
        <UserFormModal
          initialData={editingUser}
          saving={saving}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingUser(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Layout>
  );
};

export default Users;
