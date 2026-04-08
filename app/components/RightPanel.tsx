"use client";
import { CURATED } from "./../lib/data";
import type { BoardItem } from "./../types/board";

interface Props {
  selected: BoardItem | null;
  onUpdate: (id: string, patch: Partial<BoardItem>) => void;
  onDelete: (id: string) => void;
  onAdd: (item: Omit<BoardItem, "id">) => void;
}

export default function RightPanel({ selected, onUpdate, onDelete, onAdd }: Props) {
  const rnd = () => ({ x: 60 + Math.random() * 350, y: 60 + Math.random() * 280 });

  return (
    <aside className="w-52 flex-shrink-0 border-l border-sand-200 bg-sand-50 flex flex-col overflow-y-auto">

      {/* Header */}
      <div className="px-3.5 py-3 border-b border-sand-200 flex items-center justify-between">
        <span className="font-display text-[15px] text-sand-900">Properties</span>
      </div>

      {/* Properties */}
      <div className="p-3.5 border-b border-sand-200">
        {!selected ? (
          <p className="text-[11px] text-sand-400 font-mono leading-relaxed">
            Select an item on the canvas to adjust its properties.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-[9px] uppercase tracking-widest text-sand-400 font-mono">{selected.type}</p>

            {[
              { label: "X",  key: "x"      as const, val: Math.round(selected.x) },
              { label: "Y",  key: "y"      as const, val: Math.round(selected.y) },
              { label: "W",  key: "width"  as const, val: Math.round(selected.width) },
              { label: "H",  key: "height" as const, val: Math.round(selected.height) },
            ].map(({ label, key, val }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[10px] text-sand-400 font-mono">{label}</span>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => onUpdate(selected.id, { [key]: Number(e.target.value) })}
                  className="w-24 text-[11px] font-mono bg-white border border-sand-200 rounded
                    px-2 py-1 text-sand-800 focus:outline-none focus:border-sand-500"
                />
              </div>
            ))}

            {selected.type === "color" && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-sand-400 font-mono">Fill</span>
                <input
                  type="color"
                  value={selected.color ?? "#E8C99A"}
                  onChange={(e) => onUpdate(selected.id, { color: e.target.value })}
                  className="w-10 h-7 border-none bg-transparent cursor-pointer"
                />
              </div>
            )}

            {selected.type === "text" && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-sand-400 font-mono">Size</span>
                <input
                  type="number"
                  value={selected.fontSize ?? 24}
                  min={10} max={80}
                  onChange={(e) => onUpdate(selected.id, { fontSize: Number(e.target.value) })}
                  className="w-24 text-[11px] font-mono bg-white border border-sand-200 rounded
                    px-2 py-1 text-sand-800 focus:outline-none focus:border-sand-500"
                />
              </div>
            )}

            <button
              onClick={() => onDelete(selected.id)}
              className="w-full mt-2 text-[11px] font-mono py-1.5 rounded border border-red-200
                text-red-400 hover:bg-red-50 transition-colors duration-150"
            >
              Delete item
            </button>
          </div>
        )}
      </div>

      {/* Curated Finds */}
      <div className="p-3.5">
        <p className="text-[9px] tracking-[0.14em] uppercase text-sand-400 font-mono mb-3">Curated Finds</p>
        <div className="space-y-0">
          {CURATED.map((c) => (
            <button
              key={c.name}
              onClick={() =>
                onAdd({ type: "color", color: c.color, label: c.name, width: 130, height: 130, ...rnd() })
              }
              className="flex items-center gap-2.5 py-2.5 border-b border-sand-100 last:border-0
                hover:bg-sand-100 transition-colors duration-150 w-full text-left px-1 rounded-sm"
            >
              <div className="w-10 h-10 rounded flex-shrink-0" style={{ background: c.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-sand-800 leading-snug line-clamp-2 font-mono">{c.name}</p>
                <p className="text-[9px] text-sand-400 font-mono mt-0.5">{c.brand}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
