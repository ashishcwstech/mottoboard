"use client";
import { Plus, Save, Trash2, Undo, Redo, Grid3X3, Maximize2, ScanSearch, Share2, Download, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { STORAGE_KEY } from "../lib/data";

interface Props {
  rendererRef: React.RefObject<any>;
  selectBackground: (url: string) => void;
  items: any[]; // ✅ add items to props
  onCreateBoard: () => void;
  onDeleteBoard: () => void; // ✅ add delete handler
  onUndo: () => void; // ✅ add undo
  onRedo: () => void; // ✅ add redo
  canUndo: boolean; // ✅ add canUndo
  canRedo: boolean; // ✅ add canRedo
}
  
export default function Header({rendererRef,selectBackground,items, onCreateBoard,onUndo, onRedo, canUndo, canRedo,  onDeleteBoard }: Props) {
   const [fileOpen, setFileOpen] = useState(false);
   const [boardTitle, setBoardTitle] = useState("Golden Opulence");


    
  const downloadBoard = () => {
    const confirmSave = window.confirm("Do you want to save image this board?");
    if (!confirmSave) return;

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

  const generateBoardImage = () => {
    const ctx = rendererRef.current;
    if (!ctx) return null;
    const { gl, scene, camera } = ctx;
    gl.render(scene, camera);
    const dataURL = gl.domElement.toDataURL("image/png");
    return dataURL; // 👈 important
  };
    
    
  

  const handleBoardSave = () => {
    const confirmSave = window.confirm("Do you want to save this board?");
    if (!confirmSave) return;

    const image = generateBoardImage();

    try {
      const newBoard = {
        id: "board-" + Math.random().toString(36).substring(2, 9),
        title: boardTitle,
        background: selectBackground, // 👈 add background to board data
        items,
        image: image, // 👈 keep naming consistent with your UI
        createdAt: new Date().toISOString(),
      };
      // 👉 Step 1: get existing data
      const existing = localStorage.getItem(STORAGE_KEY);
      // 👉 Step 2: parse or fallback to []
      const boards = existing ? JSON.parse(existing) : [];
      // 👉 Step 3: push new board
      boards.push(newBoard);
      // 👉 Step 4: save back
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));

    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const fileRef = useRef<HTMLDivElement>(null);
    // Add outside click handler
    useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fileRef.current && !fileRef.current.contains(e.target as Node)) 
        setFileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex items-center h-[52px] border-b border-gray-200 bg-white z-50 flex-shrink-0 px-3 gap-2">
            <div className="flex items-center gap-2 mr-3 flex-shrink-0">
              <div className="w-6 h-6 rounded bg-black flex items-center justify-center">
                <div className="grid grid-cols-2 gap-[2px]">
                  {[0,1,2,3].map(i => <div key={i} className="w-[5px] h-[5px] bg-white rounded-[1px]"/>)}
                </div>
              </div>
              <span className="font-semibold text-[14px] text-gray-900 whitespace-nowrap">MattoBoard</span>
            </div>
            <div className="relative" ref={fileRef}>
                <button 
                  onClick={() => setFileOpen(p => !p)}
                    className="flex items-center gap-1 text-[12px] text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors whitespace-nowrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M4 6h16M4 12h16M4 18h16"/></svg> File
                  </button>
                   {fileOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded border border-gray-100 py-1 z-50 w-44">
                      <button
                        onClick={() => { onCreateBoard(); setFileOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Plus size={13}/> New Board
                      </button>
                      <div className="border-t border-gray-100 my-1"/>
                      <button
                        onClick={() => { onDeleteBoard(); setFileOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-[12px] text-red-500 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={13}/> Delete Board
                      </button>
                    </div>
                  )}
    
            </div>
          
    
           
            <div className="flex items-center gap-0.5 ml-2 border border-gray-200 rounded-md bg-white px-1 py-0.5">
              <ToolBtn title="Save" onClick={handleBoardSave}>
                <Save size={14}/>
              </ToolBtn>
              <ToolBtn title="Undo" onClick={onUndo} disabled={!canUndo}>
                <Undo size={14}/>
              </ToolBtn>
              <ToolBtn title="Redo" onClick={onRedo} disabled={!canRedo}>
                <Redo size={14}/>
              </ToolBtn>
              <div className="w-px h-4 bg-gray-200 mx-0.5"/>
              <ToolBtn title="Grid">
                <Grid3X3 size={14}/>
              </ToolBtn>
              <ToolBtn title="Fit">
                <Maximize2 size={14}/>
              </ToolBtn>
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
              
              {/* <button className="flex items-center gap-1.5 h-7 px-3 rounded bg-emerald-50 border border-emerald-200 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Upgrade to Pro
              </button> */}
              <div className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center text-[11px] font-bold text-white ml-1">A</div>
            </div>
          </header>
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