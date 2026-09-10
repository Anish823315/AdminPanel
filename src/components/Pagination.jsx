import React from 'react';

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`dots-${idx}`} style={{ padding: '0 4px' }}>…</span>
        ) : (
          <button key={p} className={p === page ? 'active' : ''} onClick={() => onChange(p)}>
            {p}
          </button>
        )
      )}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
};

export default Pagination;
