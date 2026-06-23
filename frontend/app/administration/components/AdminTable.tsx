"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

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
  dragWidth?: string;
  savingOrder?: boolean;
  onReorder?: (newData: T[]) => void | Promise<void>;
};

export default function AdminTable<T extends { id: number }>({
  data,
  columns,
  draggable = false,
  dragWidth = "5%",
  savingOrder = false,
  onReorder,
}: Props<T>) {
  const tableWrapRef = useRef<HTMLDivElement | null>(null);

  const draggingIdRef = useRef<number | null>(null);
  const mouseYRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const getScrollContainer = (): HTMLElement => {
    const explicit = document.querySelector(
      "[data-admin-scroll]",
    ) as HTMLElement | null;

    if (explicit && explicit.scrollHeight > explicit.clientHeight) {
      return explicit;
    }

    let el = tableWrapRef.current?.parentElement || null;

    while (el) {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;

      const canScroll =
        (overflowY === "auto" ||
          overflowY === "scroll" ||
          overflowY === "overlay") &&
        el.scrollHeight > el.clientHeight;

      if (canScroll) {
        return el;
      }

      el = el.parentElement;
    }

    return (document.scrollingElement ||
      document.documentElement) as HTMLElement;
  };

  const scrollElementBy = (el: HTMLElement, amount: number) => {
    if (
      el === document.documentElement ||
      el === document.body ||
      el === document.scrollingElement
    ) {
      window.scrollBy({
        top: amount,
        behavior: "auto",
      });
      return;
    }

    el.scrollTop += amount;
  };

  const getContainerRect = (el: HTMLElement) => {
    if (
      el === document.documentElement ||
      el === document.body ||
      el === document.scrollingElement
    ) {
      return {
        top: 0,
        bottom: window.innerHeight,
      };
    }

    const rect = el.getBoundingClientRect();

    return {
      top: rect.top,
      bottom: rect.bottom,
    };
  };

  const autoScrollLoop = () => {
    const container = scrollContainerRef.current || getScrollContainer();
    const rect = getContainerRect(container);

    const scrollZone = 140;
    const maxSpeed = 26;

    const y = mouseYRef.current;

    let speed = 0;

    if (y < rect.top + scrollZone) {
      const distance = rect.top + scrollZone - y;
      speed = -Math.ceil((distance / scrollZone) * maxSpeed);
    }

    if (y > rect.bottom - scrollZone) {
      const distance = y - (rect.bottom - scrollZone);
      speed = Math.ceil((distance / scrollZone) * maxSpeed);
    }

    if (speed !== 0) {
      scrollElementBy(container, speed);
    }

    rafRef.current = requestAnimationFrame(autoScrollLoop);
  };

  const startAutoScroll = () => {
    scrollContainerRef.current = getScrollContainer();

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(autoScrollLoop);
  };

  const stopAutoScroll = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    scrollContainerRef.current = null;
  };

  const resetDrag = () => {
    stopAutoScroll();

    draggingIdRef.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  useEffect(() => {
    const handleDocumentDragOver = (e: DragEvent) => {
      mouseYRef.current = e.clientY;
      e.preventDefault();
    };

    document.addEventListener("dragover", handleDocumentDragOver);

    return () => {
      document.removeEventListener("dragover", handleDocumentDragOver);
      stopAutoScroll();
    };
  }, []);

  const handleDrop = async (targetId: number) => {
    if (!draggable || !onReorder || savingOrder) return;

    const draggedId = draggingIdRef.current;

    if (!draggedId || draggedId === targetId) {
      resetDrag();
      return;
    }

    const fromIndex = data.findIndex((row) => row.id === draggedId);
    const toIndex = data.findIndex((row) => row.id === targetId);

    if (fromIndex === -1 || toIndex === -1) {
      resetDrag();
      return;
    }

    const newData = [...data];
    const [movedRow] = newData.splice(fromIndex, 1);

    newData.splice(toIndex, 0, movedRow);

    await onReorder(newData);

    resetDrag();
  };

  return (
    <div
      ref={tableWrapRef}
      onDragOver={(e) => {
        if (!draggable || savingOrder) return;

        e.preventDefault();
        mouseYRef.current = e.clientY;
      }}
      className="overflow-hidden rounded-[18px] border border-[#D7D9DF] bg-white shadow-sm"
    >
      <table className="w-full table-fixed">
        <colgroup>
          {draggable && <col style={{ width: dragWidth }} />}

          {columns.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>

        <thead>
          <tr className="bg-[#FAFAFA]">
            {draggable && (
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#7A7A7A]">
                Drag
              </th>
            )}

            {columns.map((column) => (
              <th
                key={column.key}
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

                mouseYRef.current = e.clientY;
                startAutoScroll();
              }}
              onDrag={(e) => {
                if (!draggable || savingOrder) return;

                if (e.clientY > 0) {
                  mouseYRef.current = e.clientY;
                }
              }}
              onDragOver={(e) => {
                if (!draggable || savingOrder) return;

                e.preventDefault();
                e.dataTransfer.dropEffect = "move";

                mouseYRef.current = e.clientY;
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
                resetDrag();
              }}
              className={`
                group border-t border-[#E6E6E6] transition-all duration-200 ease-in-out
                ${!draggingId && !dragOverId ? "hover:bg-[#F9FAFB]" : ""}
                ${
                  draggable && !savingOrder
                    ? "cursor-grab active:cursor-grabbing"
                    : ""
                }
                ${
                  draggingId === row.id
                    ? "scale-[0.98] bg-gray-50 opacity-30 shadow-inner"
                    : ""
                }
                ${
                  dragOverId === row.id && draggingId !== row.id
                    ? "border-b-[3px] border-b-indigo-500 bg-indigo-50/60 shadow-sm"
                    : ""
                }
                ${savingOrder ? "pointer-events-none opacity-70" : ""}
              `}
            >
              {draggable && (
                <td className="px-4 py-4 align-middle">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                      dragOverId === row.id && draggingId !== row.id
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
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
                <td key={column.key} className="px-6 py-4 align-middle">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {savingOrder && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#D7D9DF] bg-white px-8 py-7 shadow-[0_12px_45px_rgba(0,0,0,0.12)]">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D7D9DF] border-t-black" />

            <div className="text-sm font-semibold text-[#111]">
              Saving order...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
