// "use client";
// import { useRef, useCallback } from "react";

// interface Position { x: number; y: number; width: number; height: number; }

// type UpdateFn = (id: string, patch: Partial<Position>) => void;

// export function useDragResize(id: string, pos: Position, update: UpdateFn) {
//   const dragging = useRef(false);
//   const resizing = useRef(false);
//   const origin = useRef({ mx: 0, my: 0, ox: 0, oy: 0, ow: 0, oh: 0 });

//   const onDragMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       if ((e.target as HTMLElement).dataset.resize) return;
//       if ((e.target as HTMLElement).contentEditable === "true") return;
//       e.preventDefault();
//       dragging.current = true;
//       origin.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y, ow: pos.width, oh: pos.height };

//       const onMove = (me: MouseEvent) => {
//         if (!dragging.current) return;
//         update(id, {
//           x: origin.current.ox + me.clientX - origin.current.mx,
//           y: origin.current.oy + me.clientY - origin.current.my,
//         });
//       };
//       const onUp = () => {
//         dragging.current = false;
//         window.removeEventListener("mousemove", onMove);
//         window.removeEventListener("mouseup", onUp);
//       };
//       window.addEventListener("mousemove", onMove);
//       window.addEventListener("mouseup", onUp);
//     },
//     [id, pos, update]
//   );

//   const onResizeMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation();
//       e.preventDefault();
//       resizing.current = true;
//       origin.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y, ow: pos.width, oh: pos.height };

//       const onMove = (me: MouseEvent) => {
//         if (!resizing.current) return;
//         update(id, {
//           width:  Math.max(40, origin.current.ow + me.clientX - origin.current.mx),
//           height: Math.max(40, origin.current.oh + me.clientY - origin.current.my),
//         });
//       };
//       const onUp = () => {
//         resizing.current = false;
//         window.removeEventListener("mousemove", onMove);
//         window.removeEventListener("mouseup", onUp);
//       };
//       window.addEventListener("mousemove", onMove);
//       window.addEventListener("mouseup", onUp);
//     },
//     [id, pos, update]
//   );

//   return { onDragMouseDown, onResizeMouseDown };
// }
