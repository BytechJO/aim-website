"use client";

import { ReactNode, useRef, useState } from "react";

export type AdminColumn<T> = {
  key: string;
  label: string;
  width?: string;
  render: (row: T) => ReactNode;
};

type Props<T> = {
  data: T[];
  columns: AdminColumn<T>[];
  draggable?: boolean;
  savingOrder?: boolean;
  onReorder?: (newData: T[]) => void | Promise<void>;
};

export default function AdminTable<T extends { id: number }>({
  data,
  columns,
  draggable = false,
  savingOrder = false,
  onReorder,
}: Props<T>) {
  const draggingIdRef = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const handleDrop = async (targetId: number) => {
    if (!draggable || !onReorder || savingOrder) return;

    const draggedId = draggingIdRef.current;

    if (!draggedId || draggedId === targetId) {
      draggingIdRef.current = null;
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const fromIndex = data.findIndex((row) => row.id === draggedId);
    const toIndex = data.findIndex((row) => row.id === targetId);

    if (fromIndex === -1 || toIndex === -1) {
      draggingIdRef.current = null;
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const newData = [...data];
    const [movedRow] = newData.splice(fromIndex, 1);

    newData.splice(toIndex, 0, movedRow);

    await onReorder(newData);

    draggingIdRef.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#D7D9DF] bg-white shadow-sm">
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-[#FAFAFA]">
            {draggable && (
              <th className="w-[64px] px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#7A7A7A]">
                ترتيب
              </th>
            )}

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
              draggable={draggable && !savingOrder}
              onDragStart={(e) => {
                if (!draggable || savingOrder) return;

                draggingIdRef.current = row.id;
                setDraggingId(row.id);

                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(row.id));
              }}
              onDragOver={(e) => {
                if (!draggable || savingOrder) return;

                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverId(row.id);
              }}
              onDragLeave={() => {
                setDragOverId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(row.id);
              }}
              onDragEnd={() => {
                draggingIdRef.current = null;
                setDraggingId(null);
                setDragOverId(null);
              }}
              className={`
                group border-t border-[#E6E6E6] transition-all duration-200 ease-in-out
                ${!draggingId && !dragOverId ? "hover:bg-[#F9FAFB]" : ""}
                ${draggable && !savingOrder ? "cursor-grab active:cursor-grabbing" : ""}
                
                /* ستايل العنصر الذي يتم سحبه حالياً */
                ${draggingId === row.id ? "opacity-30 bg-gray-50 scale-[0.98] shadow-inner" : ""}
                
                /* ستايل العنصر الذي يمر فوقه السحب (مكان الإسقاط) */
                ${dragOverId === row.id && draggingId !== row.id ? "bg-indigo-50/60 border-b-[3px] !border-b-indigo-500 shadow-sm" : ""}
                
                /* ستايل الحفظ */
                ${savingOrder ? "opacity-70 pointer-events-none" : ""}
              `}
            >
              {draggable && (
                <td className="px-4 py-4 align-middle">
                  {/* أيقونة السحب الاحترافية */}
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                      dragOverId === row.id && draggingId !== row.id
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="pointer-events-none"
                    >
                      <circle cx="5" cy="3" r="1.5" fill="currentColor" />
                      <circle cx="11" cy="3" r="1.5" fill="currentColor" />
                      <circle cx="5" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="11" cy="8" r="1.5" fill="currentColor" />
                      <circle cx="5" cy="13" r="1.5" fill="currentColor" />
                      <circle cx="11" cy="13" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                </td>
              )}

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

      {savingOrder && (
        <div className="border-t border-[#E6E6E6] px-6 py-3 text-sm text-[#707070] flex items-center gap-2 bg-[#FAFAFA]">
          <svg
            className="animate-spin h-4 w-4 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Saving order...{" "}
        </div>
      )}
    </div>
  );
}
