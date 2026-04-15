"use client";
import { useState } from "react";
import type { BoardItem } from "./../types/board";
import { Filter } from "lucide-react";

interface Props {
  selectedItem: BoardItem | null;
  onUpdateItem: (id: string, patch: Partial<BoardItem>) => void;
  onDeleteItem: (id: string) => void;
  onAddMaterialColor: (color: string) => void;
}

export default function RightPanel({ selectedItem,onUpdateItem,onDeleteItem,onAddMaterialColor }: Props) {
    const [rightTab, setRightTab] = useState<"Materials"|"Properties">("Materials");
    const FLOOR_MATERIALS = [
      { id: "wg-ans",  name: "Wolf Gordon — Ansonia",   sub: "Limestone",          color: "#c9c5b8" },
      { id: "tar-cr",  name: "Tarkett — Crayon",        sub: "Razzmatazz 48012",  color: "#6b1a2a" },
      { id: "york-nw", name: "York Wallcoverings",      sub: "Network Grey Links",color: "#c2c4cc" },
      { id: "mut-mt",  name: "Mutina — Mattonelle",     sub: "Marghe Terracotta", color: "#c0512b" },
      { id: "wg-fij",  name: "Wolf Gordon — Fiji",      sub: "Caramel",           color: "#b8862e" },
      { id: "shaw-gr", name: "Shaw Contract",           sub: "Gradient Tile — French Silver 34150", color: "#9fa4a8" },
      { id: "shaw-vi", name: "Shaw Contract — Vitality",sub: "Hues — Sustain 00515", color: "#c8c8d0" },
      { id: "int-3s",  name: "Interface",               sub: "Third Space 303",   color: "#8c8fa0" },
    ];
    

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-[13px] font-semibold text-gray-800">Floor Material</h2>
          </div>
          <div className="flex border-b border-gray-100">
            {(["Materials","Properties"] as const).map(tab => (
              <button key={tab} onClick={() => setRightTab(tab)}
                className={`flex-1 py-2.5 text-[12px] font-medium transition-colors ${rightTab===tab ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500 hover:text-gray-700"}`}>
                {tab}
              </button>
            ))}
          </div>

          {rightTab === "Materials" && (
            <>
              <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium border border-gray-200 rounded-full px-2.5 py-1 hover:bg-gray-50 transition-colors">
                  <Filter size={10}/> Filter
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] bg-gray-800 text-white text-[9px] rounded-full font-bold px-1">49473</span>
                </button>
              </div>

              
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-2 gap-2">
                  {FLOOR_MATERIALS.map((m:any) => (
                    <button key={m.id}
                       onClick={() => onAddMaterialColor(m.color)}
                      className="rounded-lg overflow-hidden border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-150 text-left">
                      <div className="w-full h-[88px]" style={{backgroundColor:m.color}}/>
                      <div className="px-2 py-1.5 bg-white">
                        <p className="text-[9px] text-gray-700 font-medium leading-snug line-clamp-2">{m.name}</p>
                        <p className="text-[8px] text-gray-400 mt-0.5 leading-snug line-clamp-2">{m.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {rightTab === "Properties" && (
            <div className="flex-1 overflow-y-auto p-4">
              {!selectedItem ? (
                <p className="text-[11px] text-gray-400 leading-relaxed">Select an item on the canvas to adjust its properties.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-mono">{selectedItem.type}</p>
                  {[
                    {label:"X", key:"x" as const, val:Math.round(selectedItem.x)},
                    {label:"Y", key:"y" as const, val:Math.round(selectedItem.y)},
                    {label:"W", key:"width" as const, val:Math.round(selectedItem.width??0)},
                    {label:"H", key:"height" as const, val:Math.round(selectedItem.height??0)},
                  ].map(({label,key,val}) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-mono">{label}</span>
                      <input 
                        type="number" 
                        value={val}
                        onChange={e => onUpdateItem(selectedItem.id, {[key]:Number(e.target.value)})}
                        className="w-24 text-[11px] font-mono bg-white border border-gray-200 rounded px-2 py-1 text-gray-800 focus:outline-none focus:border-gray-400"/>
                    </div>
                  ))}
                  <button onClick={() => onDeleteItem(selectedItem.id)}
                    className="w-full mt-2 text-[11px] font-mono py-1.5 rounded border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                    Delete item
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>
  );
}
