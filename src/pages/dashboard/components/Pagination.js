function Pagination({ page, pageSize, totalItems, onPageChange, onPageSizeChange, disabled = false, label = "Table pagination", pageSizeLabel = "Rows per page" }) {
  const available = totalItems != null;
  const pageCount = Math.max(1, Math.ceil((totalItems || 0) / pageSize));
  const firstItem = totalItems ? (page - 1) * pageSize + 1 : 0;
  const lastItem = Math.min(page * pageSize, totalItems || 0);

  return (
    <nav aria-label={label} className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm">
      <p role="status" className="text-ink/70">
        {available ? `${firstItem}–${lastItem} of ${totalItems}` : "Records unavailable"}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          {pageSizeLabel}
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            disabled={disabled || !available}
            className="rounded-lg border border-sage-200 bg-white px-2 py-2 disabled:opacity-50"
          >
            {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={disabled || !available || page <= 1}
          className="rounded-lg border border-sage-200 px-3 py-2 font-semibold text-sage-700 disabled:opacity-50">
          Previous
        </button>
        <span>Page {page} of {pageCount}</span>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={disabled || !available || page >= pageCount}
          className="rounded-lg border border-sage-200 px-3 py-2 font-semibold text-sage-700 disabled:opacity-50">
          Next
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
