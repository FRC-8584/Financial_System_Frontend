import React from "react";
import "../styles/dataTable.css";

export function DataTable({ data, columns, emptyMessage }) {
  return (
    <table className="data-table">
      {data.length > 0 ? (
        <>
          <thead>
            <tr className="table-header-row">
              {columns.map((col) => (
                <th key={col.key} className="table-header-cell">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rec) => (
              <tr key={rec.id} className="table-body-row">
                {columns.map((col) => (
                  <td key={col.key} className="table-body-cell">
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
            <td className="table-empty-message" colSpan={columns.length}>
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
}