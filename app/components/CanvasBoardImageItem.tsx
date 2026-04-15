"use client";

import { useRef, forwardRef, useMemo, useEffect } from "react";
import {
  Mesh,
  MeshBasicMaterial,
} from "three";
import { useTexture } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import React from "react";
import * as THREE from 'three';

type Item = {
  id: string; 
  image: string;
  x: number;
  y: number;
  z?: number; // ✅ optional z for depth
  width: number;
  height: number;
  material:any;
  scaleX?: number; // ✅ optional scaleX
  scaleY?: number; // ✅ optional scaleY
};

type Props = {
  item: Item;
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
  onPointerUp: (e: ThreeEvent<PointerEvent>) => void;
  onPointerMove: (e: ThreeEvent<PointerEvent>) => void;
};

const CanvasBoardImageItem = forwardRef<Mesh, Props>(
  ({ item,  onPointerDown, onPointerUp, onPointerMove }, ref) => {
    const EMPTY_TEXTURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    const texturePath = item.material?.texture || EMPTY_TEXTURE;
    const texture = useTexture(texturePath) as THREE.Texture;
    useEffect(() => {
      if (!texture) return;
      if (item.material.type === "fabric") {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        const [rx, ry] = item.material.repeat ?? [1, 1];
        texture.repeat.set(rx, ry);
      } else {
        // 'texture', 'image', anything else → no tiling
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.repeat.set(1, 1);
      }
      texture.needsUpdate = true;
    }, [texture, item.material.type]);

    const groupRef = useRef<any>(null);
    const shadowRef = useRef<Mesh<any, MeshBasicMaterial>>(null);

    React.useImperativeHandle(ref, () => groupRef.current);

    useFrame(() => {
      if (!groupRef.current || !shadowRef.current) return;
      const z = groupRef.current.position.z;
      const depth = Math.max(0, Math.min(5, z));

      const scaleX = 1 + depth * 0.3;
      const scaleY = 1 + depth * 0.1;
      const opacity = Math.max(0.05, 0.2 - depth * 0.03);

      shadowRef.current.scale.set(scaleX, scaleY, 1);
      shadowRef.current.material.opacity = opacity;

      // ✅ counteract parent group rotation so shadow stays flat
      shadowRef.current.rotation.set(
        -groupRef.current.rotation.x,
        -groupRef.current.rotation.y,
        -groupRef.current.rotation.z,
      );
    });
    const w = (item.width || 500) / 100;
    const h = (item.height || 500) / 100;

    //-----------------------testing----------------
    // const targetWidth = 2;   // your desired width
    // const targetHeight = 2;  // your desired height
    // const scaleX = targetWidth / item.x;
    // const scaleY = targetHeight / item.y;
    // // keep proportion         
    // const scalePrimitive = Math.min(scaleX, scaleY);

    // const scalePrimitive = useMemo(() => {
    //   if (!gltf) return 1;

    //   const box = new Box3().setFromObject(gltf.scene);
    //   const size = new Vector3();
    //   box.getSize(size);

    //   const targetWidth = 2;
    //   const targetHeight = 2;

    //   const scaleX = targetWidth / size.x;
    //   const scaleY = targetHeight / size.y;

    //   return Math.min(scaleX, scaleY); // keep proportion
    // }, [gltf]);
    // let scalePrimitive = 1;

    // if (isModel && gltf) {
    //   const box = new Box3().setFromObject(gltf.scene);
    //   const size = new Vector3();
    //   box.getSize(size);

    //   const maxDim = Math.max(size.x, size.y, size.z);
    //   scalePrimitive = 2 / maxDim; // normalize size
    // }

    return (
      <group
        ref={groupRef}
        position={[item.x, item.y, item.z || 0]} // ✅ use item.z if available
        scale={[item.scaleX || 1, item.scaleY || 1, 1]} // ✅ THIS LINE
        // position={[item.x, item.y, 0]}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      >
        {/* Shadow — pushed back on Z to avoid z-fighting */}
        {/* <mesh
          ref={shadowRef}
          position={[0, -h * 0.55, -0.02]}
          renderOrder={-1} // ✅ render behind everything
          rotation={[-Math.PI * 0.05, 0, 0]} // slight tilt to look grounded
        >
          <planeGeometry args={[w * 0.85, h * 0.15]} />
          <meshBasicMaterial
            transparent
            opacity={0.18}
            color="#000000"
            depthWrite={false}r
            depthTest={false} // ✅ always render, ignore depth
          />
        </mesh> */}
        <mesh>
            <planeGeometry args={[w, h]} />
          {item.material.type === "fabric" ? (
            <meshStandardMaterial map={texture} color={item.material.color} roughness={item.material.roughness} metalness={item.material.metalness} />
          ) : (
              <meshStandardMaterial
              map={texture}
              transparent
              color={item.material.color}
              alphaTest={0.1}
              roughness={item.material.roughness ?? 0.7}
              metalness={item.material.metalness ?? 0.05}
            />
          )}
          
        </mesh>
      </group>
    );
  },
);

CanvasBoardImageItem.displayName = "CanvasBoardImageItem";

export default CanvasBoardImageItem;
