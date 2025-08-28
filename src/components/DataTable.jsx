import React, { useState, useEffect } from "react";

export function DataTable({ data, columns, emptyMessage }) {
  return (
    <table className="w-full border-collapse">
      {data.length > 0 ? (
        <>
          <thead>
            <tr className="bg-gray-200 text-left">
              {columns.map((col) => (
                <th key={col.key} className="p-3">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rec) => (
              <tr key={rec.id} className="border-b">
                {columns.map((col) => (
                  <td key={col.key} className="p-3">
                    {col.render ? col.render(rec) : rec[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </>
      ) : (
        <tbody>
          <tr>
            <td className="p-3 text-center" colSpan={columns.length}>
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
}