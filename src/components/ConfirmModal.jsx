import React from 'react';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmLabel = 'Delete' }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p style={{ color: '#6b7280', fontSize: 14 }}>{message}</p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
