export default function AdminTable({ columns, rows, rowKey = '_id', emptyLabel = 'No records found' }) {
  if (rows.length === 0) {
    return <div className="bg-white border border-border-beige p-10 text-center text-brown-muted">{emptyLabel}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white border border-border-beige">
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
  );
}
