"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { BACKGROUNDS, ACCESSORIES } from "../lib/data";
import type { BoardItem } from "../types/board";
import { useState } from "react";

const Icons: Record<string, React.ReactNode> = {
  Objects: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Accessories: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/></svg>,
  Background: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  Paints: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><circle cx="13" cy="10" r="7"/><path d="M6.1 16.5C4 18 3 21 3 21s3.2-.8 4.8-2.8"/><circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="14" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="11" r="1.2" fill="currentColor" stroke="none"/></svg>,
 // Collections: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><rect x="3" y="4" width="4" height="4" rx="0.5"/><rect x="3" y="9.5" width="4" height="4" rx="0.5"/><rect x="3" y="15" width="4" height="4" rx="0.5"/><path d="M10 6h11M10 11.5h11M10 17h11"/></svg>,
  Templates: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/></svg>,
  Labels: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
 // Images: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  // "My Materials": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

const NAV_ITEMS = ["Objects","Background","Accessories","Paints","Templates","Labels"] as const;
type NavItem = typeof NAV_ITEMS[number];




interface Props {
  onAddItem: (partial: Omit<BoardItem, "id">) => void;
  onAddBackground: (url: string) => void;
  onAddMaterialColor: (color: string) => void;
}

const FLOOR_MATERIALS = [
  { id: "wg-ans",  name: "Wolf Gordon — Ansonia",   sub: "Limestone",         color: "#c9c5b8" },
  { id: "tar-cr",  name: "Tarkett — Crayon",        sub: "Razzmatazz 48012",  color: "#6b1a2a" },
  { id: "york-nw", name: "York Wallcoverings",      sub: "Network Grey Links",color: "#c2c4cc" },
  { id: "mut-mt",  name: "Mutina — Mattonelle",     sub: "Marghe Terracotta", color: "#c0512b" },
  { id: "wg-fij",  name: "Wolf Gordon — Fiji",      sub: "Caramel",           color: "#b8862e" },
  { id: "shaw-gr", name: "Shaw Contract",           sub: "Gradient Tile",     color: "#9fa4a8" },
  { id: "shaw-vi", name: "Shaw Contract — Vitality",sub: "Hues — Sustain",    color: "#c8c8d0" },
  { id: "int-3s",  name: "Interface",               sub: "Third Space 303",   color: "#8c8fa0" },
];

export default function LeftSidebar({
  onAddItem,
  onAddBackground,
  onAddMaterialColor,
}: Props) {
   const [active, setActive] = useState<NavItem>("Accessories");
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex flex-shrink-0">
       <nav className="w-[88px] bg-[#111] flex flex-col items-center py-2 gap-0.5 flex-shrink-0 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavButton key={item} label={item} icon={Icons[item]} active={active===item} onClick={() => setActive(item)}/>
          ))}
        </nav>
        <aside className="w-[280px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              {/* <input
              // value={searchQuery}
                // onChange={e => onSearchChange(e.target.value)}
                placeholder={`Search ${active}`}
                className="w-full pl-7 pr-3 py-1.5 text-[12px] bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 placeholder-gray-400"
              /> */}
            </div>
          </div>

          {/* Filter bar */}
          <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium border border-gray-200 rounded-full px-2.5 py-1 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={11}/>
              Filter
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] bg-gray-800 text-white text-[9px] rounded-full font-bold px-1">
                {active === "Accessories" ? ACCESSORIES.length : active === "Background" ? BACKGROUNDS.length : 0}
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* BACKGROUND */}
            {active === "Background" && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {BACKGROUNDS.map((m, index) => (
                    <button key={index} onClick={() => onAddBackground(m.url)}
                      className="rounded-md overflow-hidden border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-left">
                      <div className="w-full h-[80px] bg-cover bg-center" style={{ backgroundImage: `url(${m.url})` }}/>
                      <div className="px-2 py-1 bg-white">
                        <p className="text-[10px] text-gray-500 font-medium truncate">Background {index + 1}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACCESSORIES */}
            {active === "Accessories" && (
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {ACCESSORIES.map((f) => (
                    <button
                      key={f.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify({
                        image: f.material.texture, z: 0.99, height: 50, width: 50, type: "Accessory", name: f.label,
                      }))}
                      onClick={() => onAddItem({ material:{type: 'texture',texture: f.material.texture}, x: 0.5, y: 0.5, z: 0.91, height: 50, width: 50, type: "Accessory", name: f.label })}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-150 text-left"
                    >
                      <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-white flex items-center justify-center border border-gray-100">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${f.material.texture})` }}/>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PAINTS */}
            {active === "Paints" && (
              <div className="p-3">
                <p className="text-[9px] tracking-[0.14em] uppercase text-gray-400 font-mono mb-3">Colour Swatches</p>
                <div className="grid grid-cols-2 gap-2">
                  {FLOOR_MATERIALS.map((m) => (
                    <button key={m.id}
                      onClick={() => onAddMaterialColor(m.color)}
                      className="rounded-lg overflow-hidden border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-150 text-left">
                      <div className="w-full h-[72px]" style={{ backgroundColor: m.color }}/>
                      <div className="px-2 py-1.5 bg-white">
                        <p className="text-[9px] text-gray-700 font-medium leading-snug line-clamp-2">{m.name}</p>
                        <p className="text-[8px] text-gray-400 mt-0.5 leading-snug line-clamp-1">{m.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {!["Background", "Accessories", "Paints"].includes(active) && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p className="text-[12px]">No {active.toLowerCase()} yet</p>
              </div>
            )}

          </div>
        </aside>

    </div>
   
  );
}



function NavButton({label, icon, active, onClick}: {label:string; icon:React.ReactNode; active:boolean; onClick:()=>void}) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center justify-center gap-[4px] rounded-lg border-none cursor-pointer transition-all duration-150"
      style={{width:70, padding:"9px 6px 7px", background:active?"#3e3e3e":"transparent", color:active?"#ffffff":"#888", outline:"none"}}
      onMouseEnter={e => { if(!active){(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.08)";(e.currentTarget as HTMLButtonElement).style.color="#ccc";} }}
      onMouseLeave={e => { if(!active){(e.currentTarget as HTMLButtonElement).style.background="transparent";(e.currentTarget as HTMLButtonElement).style.color="#888";} }}
    >
      {icon}
      <span style={{fontSize:9,letterSpacing:"0.01em",fontWeight:400,textAlign:"center",lineHeight:1.2,whiteSpace:"nowrap"}}>{label}</span>
    </button>
  );
}
