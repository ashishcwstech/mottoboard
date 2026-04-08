"use client";
import { useDragResize } from "./../lib/useDragResize";
import type { BoardItem } from "./../types/board";

interface Props {
  item: BoardItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<BoardItem>) => void;
}

export default function FurnitureBoardItem({ item, selected, onSelect, onUpdate }: Props) {
  const { onDragMouseDown, onResizeMouseDown } = useDragResize(
    item.id,
    { x: item.x, y: item.y, width: item.width, height: item.height },
    (id, patch) => onUpdate(id, patch)
  );

  return (
    <div
      onMouseDown={(e) => { onSelect(item.id); onDragMouseDown(e); }}
      className={`absolute cursor-grab active:cursor-grabbing select-none rounded flex flex-col items-center justify-center
        bg-white/60 border border-sand-200 group
        ${selected ? "ring-2 ring-sand-500 ring-offset-1" : ""}`}
      style={{ left: item.x, top: item.y, width: item.width, height: item.height }}
    >
      <span className="text-4xl leading-none">{item.icon}</span>
    {item.label && (
        <span className="text-[9px] tracking-widest text-sand-600 mt-1.5 font-mono uppercase">
          {item.label}
        </span>
      )}
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
