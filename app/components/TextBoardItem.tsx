"use client";
import { useRef } from "react";
import { useDragResize } from "./../lib/useDragResize";
import type { BoardItem } from "./../types/board";

interface Props {
  item: BoardItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<BoardItem>) => void;
}

export default function TextBoardItem({ item, selected, onSelect, onUpdate }: Props) {
  const { onDragMouseDown, onResizeMouseDown } = useDragResize(
    item.id,
    { x: item.x, y: item.y, width: item.width, height: item.height },
    (id, patch) => onUpdate(id, patch)
  );
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      onMouseDown={(e) => { onSelect(item.id); onDragMouseDown(e); }}
      className={`absolute cursor-grab active:cursor-grabbing select-none group
        ${selected ? "ring-1 ring-dashed ring-sand-400" : ""}`}
      style={{ left: item.x, top: item.y, width: item.width, minHeight: item.height }}
    >
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onMouseDown={(e) => e.stopPropagation()}
        onBlur={(e) => onUpdate(item.id, { text: e.currentTarget.textContent ?? "" })}
        className="outline-none font-display text-sand-900 px-1"
        style={{
          fontSize: item.fontSize ?? 24,
          fontStyle: item.fontStyle ?? "italic",
          minWidth: 80,
          minHeight: 40,
        }}
      >
        {item.text}
      </div>
      {selected && (
        <div
          data-resize="true"
          onMouseDown={onResizeMouseDown}
          className="absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 rounded-full bg-sand-500 cursor-se-resize z-10"
        />
      )}
    </div>
  );
}
