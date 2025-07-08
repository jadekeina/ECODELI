type ComposantTableProps = {
  columns: string[];
  rows: (string | number)[][];
};

export function ServicesTable({ columns, rows }: ComposantTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm p-4">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            {columns.map(col => (
              <th key={col} className="px-4 py-3">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-400">Aucune donnée.</td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-none hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ServicesTable;