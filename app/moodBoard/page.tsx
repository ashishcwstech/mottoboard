"use client";
import { Save, Undo, Redo, Share2, Download, FileText, Grid3X3, Maximize2, ScanSearch, Search, SlidersHorizontal, Filter, Plus, Trash2 } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { STORAGE_KEY } from "../lib/data";
import type { BoardItem } from "../types/board";
import CanvasBoard from "../components/CanvasBoard";
import LeftSidebar from "../components/LeftSidebar";
import { useHistory } from  "../hooks/materialBoard/useHistory";
import Header from "../components/Header";


const sampleItems = [
  // { id: "8", name: "Marble Tile", type: "Tile", image: "/images/accessories/8.glb", x: -2.167999999999993, y: -1.295000000000021, z: 0.0703125, width: 200, height: 200 },
  // { id: "3", name: "Marble Tile", type: "Tile", image: "/images/accessories/3.glb", x: 10, y: 10, z: 0.8, width: 200, height: 200 },
  // { id: "9", name: "Marble Tile", type: "Tile", image: "/images/accessories/9.glb", x: -1.8889999999999985, y: -0.8180000000000048, z: 0.01, width: 50, height: 50 },
  // { id: "5", name: "Marble Tile", type: "Tile", image: "/images/accessories/10.glb", x: 10, y: 10, z: 0.8, width: 200, height: 200 },
  // { id: "53", name: "Marble Tile", type: "Tile", image: "/images/accessories/53.avif", x: 10, y: 10, z: 0.5, width: 200, height: 200 },
  // { id: "54", name: "Marble Tile", type: "Tile", image: "/images/accessories/54.jpg", x: 10, y: 10, z: 0.6, width: 200, height: 200 },
  // { id: "58", name: "Marble Tile", type: "Tile", image: "/images/accessories/58.avif", x: 10, y: 10, z: 0.34, width: 200, height: 200 },
  // { id: "102", name: "Marble Tile", type: "Tile", image: "/images/accessories/102.avif", x: 10, y: 10, z: 0.8, width: 200, height: 200 },
  { id: "50", name: "Marble Tile", type: "Tile", material:{type:'texture',texture: "/images/accessories/50.png"}, image: "/images/accessories/50.png", x: -0.42600000000000093, y: -0.00799999999999821, z: 0.9, width: 50, height: 50,scaleX: 1,scaleY: 1 },
  { id: "51", name: "Marble Tile", type: "Tile", material:{type:'texture',texture: "/images/accessories/51.png"}, image: "/images/accessories/51.png", x: 2.4280000000000106, y:  0.5019999999999927, z: 0.734375, width: 100, height: 100,scaleX: 1,scaleY: 1 },
  { id: "52", name: "Marble Tile", type: "Tile", 
      material:{
        type:'fabric',texture: "/images/accessories/52.avif",
        roughness: 0.9,
        metalness: 0,
      }, image: "/images/accessories/52.avif", x: 1.1950000000000052, y: 0.37299999999997757, z: 0.7890625, width: 170, height: 300,scaleX: 1,scaleY: 1 },
  { id: "57", name: "Marble Tile", type: "Tile" ,material:{type:'texture',texture: "/images/accessories/57.jpg"}, image: "/images/accessories/57.jpg", x: 1.0270000000000068, y: 1.3750000000000013, z: 1.1, width: 80, height: 80,scaleX: 1,scaleY: 1 },
  { id: "59", name: "Marble Tile", type: "Tile" , material:{type:'texture',texture: "/images/accessories/59.avif"}, image: "/images/accessories/59.avif", x: -1.396000000000001, y: 0.10156000000000007, z: 0.86, width: 80, height: 300,scaleX: 1,scaleY: 1 },
  { id: "100", name: "Marble Tile", type: "Tile", 
      material:{
        type:'fabric',
        texture: "/images/accessories/100.avif",
        roughness: 0.9,
        metalness: 0,
      },
       image: "/images/accessories/100.avif", x: 0.4869999999999977, y: -0.10700000000002263, z: 0.7, width: 200, height: 300 },
  { id: "106", name: "Marble Tile", type: "Tile", material:{type:'texture',texture: "/images/accessories/106.avif"}, image: "/images/accessories/106.avif", x: -0.23000000000000026, y: 0.5320000000000006, z: 0.265, width: 200, height: 200,scaleX: 1,scaleY: 1 },
  { id: "107", name: "Marble Tile", type: "Tile", 
      material:
      {
        type:'fabric',
        texture: "/images/accessories/107.avif",
        roughness: 0.9,
        metalness: 0,
      },
  image: "/images/accessories/107.avif", x: -0.6049999999999762, y: 0.004000000000007045, z: 0.8, width: 200, height: 200,scaleX: 1,scaleY: 1 },
  { id: "108", name: "Marble Tile", type: "Tile", material:{type:'texture',texture: "/images/accessories/108.avif"}, image: "/images/accessories/108.avif", x:1.9599999999999993, y: -1.1899999999999906, z: 0.7, width: 100, height: 100,scaleX: 1,scaleY: 1 },
  { id: "109", name: "Marble Tile", type: "Tile",
    material:{
      type:'texture',
      texture: "/images/accessories/109.png",
      roughness: 0.9,
      metalness: 0,
    },
    image: "/images/accessories/109.png", x: 0.6760000000000002, y: -1.6550000000000054, z: 0.8, width: 300, height: 80,scaleX: 1,scaleY: 1 },
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
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
 
  
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
                ...i.material,
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


  //------------------ Template start ---------------------------------

  const handleCreateBoard = useCallback(() => {
    setActiveTemplateId(null);
    setItems([]);
    setBackground("");
  }, []);

  const onAddExistingTemplate = useCallback((template: any) => {
    if (!template || typeof template !== "object") return;
    setActiveTemplateId(template.id);
    setItems(template.items || []);
    setBackground(template.background || "");
  }, []);

  //------------------Template end ---------------------------------

  const handleDeleteBoard = () => {
    if(!activeTemplateId) return;
    const confirmDelete = window.confirm("Do you want to delete this board?");
    if (!confirmDelete) return;

    if (activeTemplateId) {
      // 👉 Step 1: get existing data
      const existing = localStorage.getItem(STORAGE_KEY);
      // 👉 Step 2: parse or fallback to []
      const boards = existing ? JSON.parse(existing) : [];
      // 👉 Step 3: filter out the deleted board
      const nextBoards = boards.filter((b: any) => b.id !== activeTemplateId);
      // 👉 Step 4: save back
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBoards));
    } 




    setActiveTemplateId(null);
    setItems([]);
    setBackground("");

  }



  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{fontFamily:"'Inter','Helvetica Neue',sans-serif",background:"#f5f4f2"}}>
      <Header
        rendererRef={rendererRef}
        selectBackground={setBackground}
        items={items}        
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onCreateBoard={handleCreateBoard}
        onDeleteBoard={handleDeleteBoard}
      />
      

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden">

        <LeftSidebar
          //onAddItem={addItem}
          onAddBackground={addBackground}
          onAddMaterialColor={addMaterialColor}
          onAddExistingTemplate ={onAddExistingTemplate}
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
            // Pass normalized device coords (-1 to +1), not pixel offsets
            const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            handleDrop(ndcX, ndcY, raw);
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



