const IMAGE_KEYS = new Set(['image', 'imageUrl']);

export default function AdminTable({ columns, rows, rowKey = '_id', emptyLabel = 'No records found' }) {
  if (rows.length === 0) {
    return <div className="bg-white border border-border-beige p-10 text-center text-brown-muted">{emptyLabel}</div>;
  }

  const imageCol = columns.find((c) => IMAGE_KEYS.has(c.key));
  const actionsCol = columns.find((c) => c.key === 'actions');
  const bodyCols = columns.filter((c) => c !== imageCol && c !== actionsCol);
  const [primaryCol, ...restCols] = bodyCols;

  return (
    <>
      {/* Card list — small screens, where a horizontally-scrolling table is unusable */}
      <div className="lg:hidden space-y-3">
        {rows.map((row) => (
          <div key={row[rowKey]} className="bg-white border border-border-beige p-4">
            <div className="flex items-start gap-3">
              {imageCol && <div className="shrink-0">{imageCol.render(row)}</div>}
              <div className="min-w-0 flex-1">
                {primaryCol && (
                  <p className="font-semibold text-espresso break-words">
                    {primaryCol.render ? primaryCol.render(row) : row[primaryCol.key]}
                  </p>
                )}
                {restCols.length > 0 && (
                  <dl className="mt-1.5 space-y-1">
                    {restCols.map((col) => (
                      <div key={col.key} className="flex flex-wrap items-center gap-x-1.5 text-sm">
                        {col.header && <dt className="text-xs uppercase tracking-wide text-brown-muted/80">{col.header}:</dt>}
                        <dd className="text-espresso">{col.render ? col.render(row) : row[col.key]}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
            {actionsCol && <div className="mt-3 pt-3 border-t border-border-beige">{actionsCol.render(row)}</div>}
          </div>
        ))}
      </div>

      {/* Table — large screens and up */}
      <div className="hidden lg:block overflow-x-auto bg-white border border-border-beige">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ivory border-b border-border-beige text-left">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold text-espresso whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[rowKey]} className="border-b border-border-beige last:border-0 hover:bg-ivory/40">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-middle">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
