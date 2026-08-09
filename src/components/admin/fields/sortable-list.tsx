"use client";

import { GripVerticalIcon } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const SORTABLE_INDEX_MIME = "application/x-sortable-index";

export function reorderList<T>(
  items: readonly T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return [...items];
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return [...items];
  }

  next.splice(toIndex, 0, moved);
  return next;
}

type SortableListContextValue = {
  draggingIndex: number | null;
  setDraggingIndex: (index: number | null) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
};

const SortableListContext = createContext<SortableListContextValue | null>(
  null,
);

function useSortableListContext(): SortableListContextValue {
  const context = useContext(SortableListContext);
  if (!context) {
    throw new Error("Sortable components must be used inside SortableList");
  }
  return context;
}

type SortableListProps = {
  readonly onReorder: (fromIndex: number, toIndex: number) => void;
  readonly children: ReactNode;
  readonly className?: string;
};

export function SortableList({
  onReorder,
  children,
  className,
}: SortableListProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  return (
    <SortableListContext value={{ draggingIndex, setDraggingIndex, onReorder }}>
      <div className={cn("space-y-3", className)}>{children}</div>
    </SortableListContext>
  );
}

type SortableItemProps = {
  readonly index: number;
  readonly children: ReactNode;
  readonly className?: string;
};

export function SortableItem({
  index,
  children,
  className,
}: SortableItemProps) {
  const { draggingIndex, onReorder } = useSortableListContext();
  const itemRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);
  const isDragging = draggingIndex === index;

  return (
    <div
      ref={itemRef}
      data-sortable-item
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsOver(false);
        const fromIndex = Number(
          event.dataTransfer.getData(SORTABLE_INDEX_MIME),
        );
        if (!Number.isNaN(fromIndex)) {
          onReorder(fromIndex, index);
        }
      }}
      className={cn(
        className,
        isDragging && "opacity-50",
        isOver && "ring-2 ring-primary/30",
      )}
    >
      {children}
    </div>
  );
}

type SortableDragHandleProps = {
  readonly index: number;
  readonly className?: string;
};

export function SortableDragHandle({
  index,
  className,
}: SortableDragHandleProps) {
  const { setDraggingIndex } = useSortableListContext();
  const handleRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={handleRef}
      type="button"
      draggable
      aria-label="Drag to reorder"
      className={cn(
        "flex shrink-0 cursor-grab touch-none items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing",
        className,
      )}
      onDragStart={(event) => {
        setDraggingIndex(index);
        event.dataTransfer.setData(SORTABLE_INDEX_MIME, String(index));
        event.dataTransfer.effectAllowed = "move";

        const row = handleRef.current?.closest("[data-sortable-item]");
        if (row instanceof HTMLElement) {
          event.dataTransfer.setDragImage(row, 32, 32);
        }
      }}
      onDragEnd={() => setDraggingIndex(null)}
    >
      <GripVerticalIcon className="size-4" />
    </button>
  );
}

export function SortableItemRow({
  index,
  children,
  className,
}: SortableItemProps) {
  return (
    <SortableItem index={index} className={className}>
      {children}
    </SortableItem>
  );
}
