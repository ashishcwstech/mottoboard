"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Trash2,Plus,Minus, RotateCw } from "lucide-react";
import CanvasBoardImageItem from "./CanvasBoardImageItem";
import type { BoardItem } from "../types/board";

import { Position, Rnd } from "react-rnd";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useTexture, TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { Mesh, TextureLoader,MOUSE } from "three";
import { useThree } from '@react-three/fiber';

interface Props {
  items: BoardItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<BoardItem>) => void;
  onDrop: (x: number, y: number, data: string) => void;
  onDelete: (id: string) => void;
  background: string | null;
  onSaveSnapshot: (items: BoardItem[]) => void;
  onReady?: (ctx: {
    gl: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
  }) => void;
}

type State = {
  position: { x: number; y: number };
  scale: number;
  items: BoardItem[]; // if you have objects on board
};

export default function CanvasBoard({ items, selectedId, onSelect, onUpdate, onDrop,onDelete, background,onSaveSnapshot,onReady }: Props) { 
  const [position, setPosition] = useState({ x: 0, y: 0 });  
  const start = useRef({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const isBoardDragging = useRef(false);
  const [isBoardIteamDragging, setIsBoardIteamDragging] = useState(false);
  const hasCanvasBoardDragged = useRef(false);
  const hasCanvasBoardItemDragged = useRef(false);
  

  const [activeBoardItemId, setActiveBoardItemId] = useState<string | null>(null);
  const [isItemRotating, setIsItemRotating] = useState(false);
  const itemRefs = useRef<{ [key: string]: any }>({});  



  const flushAndSave = useCallback(() => {
    const synced = items.map((item: any) => {
      const ref = itemRefs.current[item.id];
      if (!ref) return item;
      return { ...item, x: ref.position.x, y: ref.position.y, z: ref.position.z };
    });
    // Write back to parent React state too
    synced.forEach(item => onUpdate(item.id, { x: item.x, y: item.y, z: item.z }));
    onSaveSnapshot(synced);
  }, [items, onUpdate, onSaveSnapshot]);

  //------------pointer up for background and items----------------
  const handleCanvasPointerUp = () => {
    if(isBoardIteamDragging) return;
    // ✅ only save when board was being panned
    if (isBoardDragging.current && hasCanvasBoardDragged.current) { // ✅ canvas ref
      flushAndSave();
    }
    isBoardDragging.current = false; 
    hasCanvasBoardDragged.current = false;
   
  };
  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (isBoardIteamDragging && hasCanvasBoardItemDragged.current) { // ✅ item ref
      flushAndSave();
    }
    setIsBoardIteamDragging(false);
    hasCanvasBoardItemDragged.current = false; // ✅ reset
  };

  //--------------pointer move for items----------------
  const handlePointerMove = (e: ThreeEvent<PointerEvent>, id: string) => {
    if (!isBoardIteamDragging || activeBoardItemId !== id) return; // ✅ ONLY move when holding
    if (isItemRotating) return;  // 🔥 skip move when rotating
    if (e.buttons !== 1) return; // 🔥 FIX: only drag when mouse is pressed

    const currentRef = itemRefs.current[id];
    if (!currentRef) return;
    // currentRef.position.x += e.movementX * 0.003;
    // currentRef.position.y -= e.movementY * 0.003;
    currentRef.position.x += (e.movementX * 0.003) / scale;
    currentRef.position.y -= (e.movementY * 0.003) / scale;
    hasCanvasBoardItemDragged.current = true; // ✅ real movement happened
    console.log('Moving item:', id, 'New position:', currentRef.position);
  };

  

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isBoardDragging.current) return;
    setActiveBoardItemId(null);
    onSelect(null);
    setIsItemRotating(false);
    const dx = (e.clientX - start.current.x) / 100;
    const dy = (e.clientY - start.current.y) / 100;
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y - dy,
    }));
    
    start.current = { x: e.clientX, y: e.clientY };
    hasCanvasBoardDragged.current = true; // ✅ real movement happened
    // setPosition({
    //   x: e.clientX - start.current.x,
    //   y: e.clientY - start.current.y,
    // });
  };


  //--------------------pointer down for background and items----------------

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;   // ✅ left only
    if (isBoardIteamDragging) return;
    isBoardDragging.current = true;
    hasCanvasBoardDragged.current = false; // ✅ reset
    start.current = { x: e.clientX, y: e.clientY };
    // start.current = {
    //   x: e.clientX - position.x,
    //   y: e.clientY - position.y,
    // };
  };
  const handlePointerDown = (e: ThreeEvent<PointerEvent>, id: string) => {
    if (e.button !== 0) return;  // ✅ left only
    e.stopPropagation(); // 🔥 stop canvas drag
    setIsBoardIteamDragging(true);
    setActiveBoardItemId(id);
     onSelect(id);
     console.log('id',selectedId);
    setZRotation(itemRefs.current[id].position.z)   //set z axis when item click

    hasCanvasBoardItemDragged.current = false; // ✅ reset
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };


  //--------------------other handlers----------------
  const handleItemDelete = (id: string) => {
    onDelete(id);
    setActiveBoardItemId(null);
    setIsItemRotating(false);
  };

  const handleItemZoom = (id: string, factor: number) => {
    const currentRef = itemRefs.current[id];
    if (!currentRef) return;
    currentRef.scale.x *= factor;
    currentRef.scale.y *= factor;
  };

  const handleItemRotate = () => {
    setIsItemRotating((prev) => !prev);
  };

  //---------------z axis rotation handler ---------------
  const MAX_Z = 2; 
  const [zRotation, setZRotation] = useState(0.1); // 0 → 1
  const handleItemAxis = (
      id: string,
      e: React.MouseEvent<HTMLDivElement>
  ) => {
    const ref = itemRefs.current[id];
    if (!ref) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    const y = e.clientY - rect.top;
    const height = container.clientHeight;

    let percent = 1 - y / height;
    percent = Math.max(0, Math.min(1, percent));

    setZRotation(percent);        // UI knob
    ref.position.z = percent * MAX_Z; // movement
    flushAndSave();
  };
 

  

  // const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   const raw = e.dataTransfer.getData("application/board-item");
  //   if (!raw) return;
  //   const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  //   onDrop(e.clientX - rect.left - 55, e.clientY - rect.top - 40, raw);
  // };


  // const boardRef = useRef<THREE.Group>(null!);


  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // ✅ wheel handler — replace saveState() with flushAndSave()
  // Also add flushAndSave to the dependency array
  useEffect(() => {
    const el = canvasWrapperRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((prev) => {
        const next = prev - e.deltaY * 0.0003;
        return Math.min(Math.max(next, 0.5), 2);
      });
      flushAndSave();   // ✅
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [flushAndSave]);  // ✅ flushAndSave in deps, not empty array




  return (
    <div
      ref={canvasWrapperRef} 
      className="w-full h-screen flex-1 relative overflow-hidden bg-gray-200 bg-sand-100 bg-dot-pattern bg-dot-28 bg-cover bg-center"
    >
      {activeBoardItemId && (
        <div className="absolute top-10 left-10   rounded p-2 flex gap-2 z-50">        
            <div className="grid  top-10 left-10 bg-white  shadow-lg rounded p-2  gap-2">
              <button
                onClick={() => handleItemDelete(activeBoardItemId)}
                className="px-2 py-1  text-black rounded"
              >
                <Trash2 size={18} />
              </button>
              {/* 🔄 Rotate */}
              <button
                onClick={() => handleItemRotate()}
                className="p-2 rounded"
                title="Rotate"
              >
                <RotateCw size={18}  />
              </button>
              <button
                onClick={() => handleItemZoom(activeBoardItemId, 1.2)}
                className="px-2 py-1  text-black  rounded"
              >
                <Plus size={18} />
              </button>
              
              <button
                onClick={() => handleItemZoom(activeBoardItemId, 0.8)}
                className="px-2 py-1  text-black rounded"
              >
                <Minus size={18} />
              </button>
            </div>
            <div>
                <div
                  onMouseMove={(e) =>
                    e.buttons === 1 &&
                    activeBoardItemId &&
                    handleItemAxis(activeBoardItemId, e)
                  }
                  onMouseDown={(e) =>
                    activeBoardItemId &&
                    handleItemAxis(activeBoardItemId, e)
                  }
                   className="relative h-64 w-3 bg-green-500 rounded-full cursor-pointer"
                >
                <div
                    className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow"
                    style={{
                      bottom:`${zRotation * 100}%`,
                    }}
                  />
                </div>
            </div>

        </div>
      )}

        <Canvas
          shadows
          gl={{ antialias: true }}
          onCreated={({ gl, scene, camera }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFShadowMap;
            onReady?.({ gl, scene, camera });
          }}

          // onCreated={({ camera }) => {
          //   camera.lookAt(0, 0, 0);
          // }}
          onContextMenu={(e) => e.preventDefault()} // ✅ important
          style={{ pointerEvents: "auto" }}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          camera={{ position: [0, 0, 6], fov: 50 }}
        >
          <group position={[position.x, position.y, 0]} scale={[scale, scale, scale]}>
                {background && <Background image={background} position={position}
                scale={scale} />}

                {/* Light */}
                <ambientLight intensity={0.5} />
                <directionalLight 
                  position={[5, 5, 5]}
                  intensity={1}
                  castShadow
                />

                  {items.map((item:any) => (
                    <CanvasBoardImageItem
                      ref={(el:any) => (itemRefs.current[item.id] = el)}
                      //scale={scale}
                      key={item.id}
                      item={item}
                      onPointerDown={(e) => handlePointerDown(e, item.id)} // ✅ pass id
                      onPointerUp={handlePointerUp}
                      onPointerMove={(e) => handlePointerMove(e, item.id)}
                    />
                  ))}

                  
                  {activeBoardItemId && isItemRotating && itemRefs.current[activeBoardItemId] && (
                    // <TransformControls
                    //   mode="rotate"
                    //   object={itemRefs.current[activeBoardItemId]}
                    //   onMouseDown={() => (isBoardDragging.current = false)}
                    // />
                    <TransformControls
                      mode="rotate"
                      object={itemRefs.current[activeBoardItemId] || undefined}
                      rotation={[0, 0,0]} // optional: initial rotation
                      showX={false}
                      showY={false}
                      showZ={true} // Only allow Z rotation
                       onMouseDown={() => (isBoardDragging.current = false)}
                      // onDraggingChanged={(e) => {
                      //   isBoardDragging.current = !e.value;
                      // }}
                    />
                  )}
          </group>
            
          {/* Camera control */}
          {/* <OrbitControls           3D VIEW
              enablePan={true}
              enabled={!isBoardIteamDragging} // ✅ disable when dragging
              enableZoom={true}
              enableRotate={true}
              mouseButtons={{
                LEFT: MOUSE.PAN,     // left click → pan
                MIDDLE: MOUSE.DOLLY, // scroll click → zoom
                RIGHT: MOUSE.ROTATE, // right click → rotate ✅
              }}    
              minPolarAngle={Math.PI / 8}   // 🔽 minimum tilt (45°)
              maxPolarAngle={Math.PI / 2}   // 🔼 maximum tilt (90°) 
              minAzimuthAngle={-Math.PI / 4}
              maxAzimuthAngle={Math.PI / 4}
            /> */}
            <OrbitControls
              enableRotate={false}
              enablePan={false}   // optional (since you already handle pan)
              enableZoom={false}  // you already use wheel zoom
            />
        </Canvas>

    </div>
  );
}


type BackgroundProps = {
  image: string;
  position: Position;
  scale: number;
};

function Background({ image, position, scale }: BackgroundProps) {
  const meshRef = useRef<Mesh | null>(null);
  const texture = useTexture(image);

  if (!image) return null;

  return (
    <mesh
      ref={meshRef}
      //position={[0, 0, -1]}
      position={[position.x, position.y, -1]}
     // scale={[scale, scale, 1]}
      rotation={[0, 0, 0]}
      //scale={[1, 1, 1]}
    >
      <planeGeometry args={[10, 6]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}






