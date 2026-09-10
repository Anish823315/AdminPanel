import React, { useState } from 'react';

const emptyForm = { name: '', email: '', phone: '', role: 'user', status: 'active' };

const UserFormModal = ({ initialData, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Valid email is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSave(form);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{initialData ? 'Edit User' : 'Add User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
          </div>
          <div className="field">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
