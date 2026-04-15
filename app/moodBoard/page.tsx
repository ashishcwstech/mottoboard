"use client"; 
import { Save, Undo, Redo, Share2, Download, FileText, Grid3X3, Maximize2, ScanSearch, Search, SlidersHorizontal, Filter, Plus, Trash2 } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { STORAGE_KEY } from "../lib/data";
import type { BoardItem } from "../types/board";
import CanvasBoard from "../components/CanvasBoard";
import LeftSidebar from "../components/LeftSidebar";
import { useHistory } from  "../hooks/materialBoard/useHistory";
import Header from "../components/Header";
import RightPanel from "../components/RightPanel";


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



let counter = 100;
const uid = () => `item-${++counter}`;

export default function MaterialBoard() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  
  
  const [items, setItems] = useState<BoardItem[]>(sampleItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedBackground, setBackground] = useState<string>("/images/background/8.jpg");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
 
  
  

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
        <RightPanel
          selectedItem={selectedItem}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          onAddMaterialColor={addMaterialColor}
        />
      </div>
    </div>
  );
}



