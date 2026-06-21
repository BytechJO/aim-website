"use client";

import { ReactNode } from "react";

export type AdminColumn<T> = {
  key: string;
  label: string;
  width?: string;
  render: (row: T) => ReactNode;
};

type Props<T> = {
  data: T[];
  columns: AdminColumn<T>[];
};

export default function AdminTable<T extends { id: number }>({
  data,
  columns,
}: Props<T>) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#D7D9DF] bg-white ">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-[#FAFAFA]">
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#7A7A7A]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-t border-[#E6E6E6] transition-colors hover:bg-[#FAFAFA]"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{ width: column.width }}
                  className="px-6 py-4 align-middle"
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
