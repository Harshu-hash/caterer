// Compact pager: prev/next plus a windowed set of page numbers with ellipses,
// so large result sets (dozens of pages) don't render a button per page.
function getPageWindow(page, totalPages, windowSize = 1) {
  const pages = new Set([1, totalPages]);
  for (let p = page - windowSize; p <= page + windowSize; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;
  const pages = getPageWindow(page, totalPages);
  const items = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) items.push({ type: 'ellipsis', key: `e-${p}` });
    items.push({ type: 'page', key: p, value: p });
    prev = p;
  }

  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 text-sm border border-border-beige bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        ‹
      </button>
      {items.map((it) =>
        it.type === 'ellipsis' ? (
          <span key={it.key} className="w-9 h-9 flex items-center justify-center text-sm text-brown-muted">
            …
          </span>
        ) : (
          <button
            key={it.key}
            type="button"
            onClick={() => onPageChange(it.value)}
            aria-current={it.value === page ? 'page' : undefined}
            className={`w-9 h-9 text-sm ${it.value === page ? 'bg-maroon text-ivory' : 'border border-border-beige bg-white'}`}
          >
            {it.value}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-9 h-9 text-sm border border-border-beige bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
