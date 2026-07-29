import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export function DataTable({ 
  columns, 
  data, 
  sortColumn, 
  sortDirection, 
  onSort, 
  onRowClick,
  rowHeight = 52 
}) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
      <div 
        ref={parentRef}
        className="max-h-[650px] overflow-auto scrollbar-thin scrollbar-thumb-slate-800"
      >
        <table className="w-full min-w-[640px] text-left text-xs text-slate-300 border-collapse">
          {/* Table Header */}
          <thead className="sticky top-0 z-10 bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr className="flex items-center">
              {columns.map((col) => {
                const isSorted = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && onSort && onSort(col.key)}
                    className={`px-4 py-3 select-none flex-1 ${col.sortable !== false ? 'cursor-pointer hover:text-slate-200' : ''} ${col.className || ''}`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className="text-slate-600">
                          {isSorted ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-emerald-400" /> : <ArrowDown className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body (Virtualized) */}
          <tbody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative'
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = data[virtualRow.index];
              return (
                <tr
                  key={virtualRow.key}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                  className="border-b border-slate-800/40 hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-2 flex-1 text-slate-200 ${col.className || ''}`}>
                      {col.cell ? col.cell(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
