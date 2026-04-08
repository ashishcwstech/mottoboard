"use client";
import { Save, Undo, Redo, Share2, Download, FileText, Grid3X3, Maximize2, ScanSearch, Search, SlidersHorizontal, Filter } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import type { BoardItem } from "../types/board";
import CanvasBoard from "../components/CanvasBoard";
import LeftSidebar from "../components/LeftSidebar";
import { useHistory } from  "../hooks/materialBoard/useHistory";


const sampleItems = [
  // { id: "8", name: "Marble Tile", type: "Tile", image: "/images/accessories/8.glb", x: -2.167999999999993, y: -1.295000000000021, z: 0.0703125, width: 200, height: 200 },
  // { id: "3", name: "Marble Tile", type: "Tile", image: "/images/accessories/3.glb", x: 10, y: 10, z: 0.8, width: 200, height: 200 },
  // { id: "9", name: "Marble Tile", type: "Tile", image: "/images/accessories/9.glb", x: -1.8889999999999985, y: -0.8180000000000048, z: 0.01, width: 50, height: 50 },
  // { id: "5", name: "Marble Tile", type: "Tile", image: "/images/accessories/10.glb", x: 10, y: 10, z: 0.8, width: 200, height: 200 },
  // { id: "53", name: "Marble Tile", type: "Tile", image: "/images/accessories/53.avif", x: 10, y: 10, z: 0.5, width: 200, height: 200 },
  // { id: "54", name: "Marble Tile", type: "Tile", image: "/images/accessories/54.jpg", x: 10, y: 10, z: 0.6, width: 200, height: 200 },
  // { id: "58", name: "Marble Tile", type: "Tile", image: "/images/accessories/58.avif", x: 10, y: 10, z: 0.34, width: 200, height: 200 },
  // { id: "102", name: "Marble Tile", type: "Tile", image: "/images/accessories/102.avif", x: 10, y: 10, z: 0.8, width: 200, height: 200 },
  { id: "50", name: "Marble Tile", type: "Tile", material:{type:'texture',texture: "/images/accessories/50.png"}, image: "/images/accessories/50.png", x: -0.42600000000000093, y: -0.00799999999999821, z: 0.9, width: 50, height: 50 },
  { id: "51", name: "Marble Tile", type: "Tile", material:{type:'texture',texture: "/images/accessories/51.png"}, image: "/images/accessories/51.png", x: 2.4280000000000106, y:  0.5019999999999927, z: 0.734375, width: 100, height: 100 },
  { id: "52", name: "Marble Tile", type: "Tile", 
      material:{
        type:'fabric',texture: "/images/accessories/52.avif",
        roughness: 0.9,
        metalness: 0,
      }, image: "/images/accessories/52.avif", x: 1.1950000000000052, y: 0.37299999999997757, z: 0.7890625, width: 170, height: 300 },
  { id: "57", name: "Marble Tile", type: "Tile" ,material:{type:'texture',texture: "/images/accessories/57.jpg"}, image: "/images/accessories/57.jpg", x: 1.0270000000000068, y: 1.3750000000000013, z: 1.1, width: 80, height: 80 },
  { id: "59", name: "Marble Tile", type: "Tile" , material:{type:'texture',texture: "/images/accessories/59.avif"}, image: "/images/accessories/59.avif", x: -1.396000000000001, y: 0.10156000000000007, z: 0.86, width: 80, height: 300 },
  { id: "100", name: "Marble Tile", type: "Tile", 
      material:{
        type:'fabric',
        texture: "/images/accessories/100.avif",
        roughness: 0.9,
        metalness: 0,
      },
       image: "/images/accessories/100.avif", x: 0.4869999999999977, y: -0.10700000000002263, z: 0.7, width: 200, height: 300 },
  { id: "106", name: "Marble Tile", type: "Tile", material:{type:'texture',texture: "/images/accessories/106.avif"}, image: "/images/accessories/106.avif", x: -0.23000000000000026, y: 0.5320000000000006, z: 0.265, width: 200, height: 200 },
  { id: "107", name: "Marble Tile", type: "Tile", 
      material:
      {
        type:'fabric',
        texture: "/images/accessories/107.avif",
        roughness: 0.9,
        metalness: 0,
      },
  image: "/images/accessories/107.avif", x: -0.6049999999999762, y: 0.004000000000007045, z: 0.8, width: 200, height: 200 },
  { id: "108", name: "Marble Tile", type: "Tile", material:{type:'texture',texture: "/images/accessories/108.avif"}, image: "/images/accessories/108.avif", x:1.9599999999999993, y: -1.1899999999999906, z: 0.7, width: 100, height: 100 },
  { id: "109", name: "Marble Tile", type: "Tile",
    material:{
      type:'texture',
      texture: "/images/accessories/109.png",
      roughness: 0.9,
      metalness: 0,
    },
    image: "/images/accessories/109.png", x: 0.6760000000000002, y: -1.6550000000000054, z: 0.8, width: 300, height: 80 },
];

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



let counter = 100;
const uid = () => `item-${++counter}`;

export default function MaterialBoard() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  
  const [items, setItems] = useState<BoardItem[]>(sampleItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedBackground, setBackground] = useState<string>("/images/background/8.jpg");
 
  const [boardTitle, setBoardTitle] = useState("Golden Opulence");
  const [rightTab, setRightTab] = useState<"Materials"|"Properties">("Materials");

  //-----------------------boardHistory start---------------------------------
  const { saveSnapshot, undo, redo, canUndo, canRedo } = useHistory(sampleItems);
    // Wrap undo/redo so they don't need setItems passed manually each call
    // ✅ undo/redo return the snapshot — call setItems yourself
    const handleUndo = useCallback(() => {
      const snapshot = undo();
      console.log('snapshot',snapshot);
      if (snapshot) setItems(snapshot);
    }, [undo]);

    const handleRedo = useCallback(() => {
      const snapshot = redo();
      if (snapshot) setItems(snapshot);
    }, [redo]);
    // Keyboard shortcut — lives in parent, no stale closure issues
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "z") { e.preventDefault(); handleUndo(); }
        if (e.ctrlKey && e.key === "y") { e.preventDefault(); handleRedo(); }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [handleUndo, handleRedo]);
    //-----------------------boardHistory end---------------------------------

  


  const addItem = useCallback((partial: Omit<BoardItem,"id">) => {
    const item: BoardItem = { ...partial, id: uid() };
    setItems((prev) => {
      const next = [...prev, item];
      saveSnapshot(next); // ✅ snapshot the new list immediately
      return next;
    });
    setSelectedId(item.id);
  }, []);

  const addBackground = useCallback((image: string) => { setBackground(image); }, []);

  const addMaterialColor = useCallback((colorCode: string) => {
      if (!selectedId) return; // 👈 guard
      setItems((prev: any) =>
        prev.map((i: any) => {
          if (i.id === selectedId) {
            return {
              ...i,
              material: {
                type: 'color',
                color: colorCode,
              },
            };
          }
          return i;
        })
      );
      console.log(items);

  }, [selectedId]);

  const updateItem = useCallback((id: string, patch: Partial<BoardItem>) => {
    setItems((prev:any) => prev.map((i:any) => (i.id === id ? {...i,...patch} : i)));
  }, []);

  const handleSelectedItemId = useCallback((id: any) => {
    // console.log('check id',id);
      setSelectedId(id);
  },[])

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveSnapshot(next); // ✅ snapshot after delete
      return next;
    });
    setSelectedId(null);
  }, []);

  const handleDrop = useCallback((x: number, y: number, raw: string) => {
    try { const data = JSON.parse(raw); addItem({...data, x, y}); } catch {}
  }, [addItem]);

  const selectedItem = (items as any[]).find(i => i.id === selectedId) ?? null;

  
  const downloadBoard = () => {
    const ctx = rendererRef.current;
    if (!ctx) return;

    const { gl, scene, camera } = ctx;

    // render latest frame
    gl.render(scene, camera);

    const dataURL = gl.domElement.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "material-board.png";
    link.click();
  };



  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{fontFamily:"'Inter','Helvetica Neue',sans-serif",background:"#f5f4f2"}}>

      <header className="flex items-center h-[52px] border-b border-gray-200 bg-white z-50 flex-shrink-0 px-3 gap-2">
        <div className="flex items-center gap-2 mr-3 flex-shrink-0">
          <div className="w-6 h-6 rounded bg-black flex items-center justify-center">
            <div className="grid grid-cols-2 gap-[2px]">
              {[0,1,2,3].map(i => <div key={i} className="w-[5px] h-[5px] bg-white rounded-[1px]"/>)}
            </div>
          </div>
          <span className="font-semibold text-[14px] text-gray-900 whitespace-nowrap">MattoBoard</span>
        </div>
        <button className="flex items-center gap-1 text-[12px] text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors whitespace-nowrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M4 6h16M4 12h16M4 18h16"/></svg> File
        </button>
        <button className="flex items-center gap-1 text-[12px] text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors whitespace-nowrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> My Projects
        </button>
        <div className="flex items-center gap-0.5 ml-2 border border-gray-200 rounded-md bg-white px-1 py-0.5">
          <ToolBtn title="Save"><Save size={14}/></ToolBtn>
          <ToolBtn title="Undo" onClick={handleUndo} disabled={!canUndo}><Undo size={14}/></ToolBtn>
          <ToolBtn title="Redo" onClick={handleRedo} disabled={!canRedo}><Redo size={14}/></ToolBtn>
          <div className="w-px h-4 bg-gray-200 mx-0.5"/>
          <ToolBtn title="Grid"><Grid3X3 size={14}/></ToolBtn>
          <ToolBtn title="Fit"><Maximize2 size={14}/></ToolBtn>
          <ToolBtn title="Focus"><ScanSearch size={14}/></ToolBtn>
        </div>
        <div className="flex-1 flex justify-center">
          <input value={boardTitle} onChange={e => setBoardTitle(e.target.value)}
            className="text-[15px] font-medium text-gray-800 text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-500 focus:outline-none px-3 py-0.5 min-w-[160px]"/>
        </div>
        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 h-7 px-3 rounded border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Share2 size={12}/> Share
          </button>
          <button
            onClick={() => downloadBoard()}
            className="flex items-center gap-1.5 h-7 px-3 rounded border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Download size={12}/> Download
          </button>
          <button className="flex items-center h-7 px-2.5 rounded border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <FileText size={13}/>
          </button>
          <button className="flex items-center gap-1.5 h-7 px-3 rounded bg-emerald-50 border border-emerald-200 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Upgrade to Pro
          </button>
          <div className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center text-[11px] font-bold text-white ml-1">A</div>
        </div>
      </header>

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden">

        
        <LeftSidebar
          onAddItem={addItem}
          onAddBackground={addBackground}
          onAddMaterialColor={addMaterialColor}
        />

        {/* CANVAS */}
        <div 
          ref={canvasRef} 
          className="flex-1 flex flex-col overflow-hidden"
          onDragOver={(e) => e.preventDefault()}   // required to allow drop
          onDrop={(e) => {
            e.preventDefault();
            const raw = e.dataTransfer.getData("application/json");
            if (!raw) return;
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            // Convert screen px → canvas-relative coords (0–1 range, or whatever your coord system uses)
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handleDrop(x, y, raw);
          }}
        >
          <CanvasBoard 
            items={items} 
            selectedId={selectedId} 
            onSelect={handleSelectedItemId}
            onUpdate={updateItem} 
            onDrop={handleDrop} 
            onDelete={deleteItem} 
            background={selectedBackground}
            onSaveSnapshot={saveSnapshot} 
            onReady={(ctx) => (rendererRef.current = ctx)} // ✅ important
          />
        </div>

        {/* RIGHT PANEL */}
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
                       onClick={() => addMaterialColor(m.color)}
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
                        onChange={e => updateItem(selectedItem.id, {[key]:Number(e.target.value)})}
                        className="w-24 text-[11px] font-mono bg-white border border-gray-200 rounded px-2 py-1 text-gray-800 focus:outline-none focus:border-gray-400"/>
                    </div>
                  ))}
                  <button onClick={() => deleteItem(selectedItem.id)}
                    className="w-full mt-2 text-[11px] font-mono py-1.5 rounded border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                    Delete item
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function ToolBtn({
  children,
  title,
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
    disabled?: boolean; // ✅ FIXED
}) {
  return (
    <button
      title={title}
      onClick={onClick} // ✅ THIS
      disabled={disabled} // ✅ FIXED
      className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  );
}

