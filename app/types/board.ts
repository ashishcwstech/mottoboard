export type BoardItemType = "color" | "furniture" | "text" | "Fabric" | "Wood" | "Tile";

export interface BoardItem {
  z: number;
  id: string;
  type: string;
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
  width?: number;
  height?: number;
  name?:string;
  // color items
  image?:string;
  material:any;
  color?: string;
  label?: string;
  // furniture items
  icon?: string;
  // text items
  text?: string;
  fontSize?: number;
  fontStyle?: "normal" | "italic";
}

export interface PaletteColor {
  hex: string;
  name: string;
}

export interface BackGound {
  url: string;
}

export interface ACCESSORIESITEMS {
  id?:string;
  label:string;
  material:any;
  scaleX:number;
  scaleY:number;
}

export interface CuratedItem {
  name: string;
  brand: string;
  color: string;
}
