import React from "react";

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
}

const Table = <T extends object>({
  columns,
  data,
  keyExtractor,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-sky-50 to-blue-50">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${
                  col.headerClassName || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-sky-50/50 transition-colors group"
              >
                {columns.map((col, index) => (
                  <td
                    key={index}
                    className={`px-6 py-4 whitespace-nowrap ${
                      col.cellClassName || ""
                    }`}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="w-12 h-12 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-slate-500 font-medium">
                    Tidak ada data ditemukan
                  </p>
                  <p className="text-sm text-slate-400">
                    Data yang Anda cari tidak tersedia saat ini.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;