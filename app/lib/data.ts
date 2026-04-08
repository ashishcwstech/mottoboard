import type { BoardItem, PaletteColor, BackGound, ACCESSORIESITEMS, CuratedItem } from "./../types/board";


export const BACKGROUNDS: BackGound[] = [
    {  url:"/images/background/1.jpg" },
    {  url:"/images/background/2.jpg" },
    {  url:"/images/background/3.jpg" },
    {  url:"/images/background/4.jpg" },
    {  url:"/images/background/5.jpg" },
    {  url:"/images/background/6.jpg" },
    {  url:"/images/background/7.jpg" },
    {  url:"/images/background/8.jpg" },
    {  url:"/images/background/9.jpg" },
    {  url:"/images/background/10.jpg" },
    {  url:"/images/background/11.jpg" },
    {  url:"/images/background/12.jpg" },
];

export const ACCESSORIES: ACCESSORIESITEMS[] = [
  {id: "50", label: "Cha",material:{type:'texture',texture: "/images/accessories/50.png"}  }, 
  {id: "51", label: "51",material:{type:'texture',texture: "/images/accessories/51.png"}   }, 
  {id: "52", label: "52",material:{type:'texture',texture: "/images/accessories/52.avif"}   }, 
  {id: "53", label: "53",material:{type:'texture',texture: "/images/accessories/53.avif"}   },   
  {id: "58", label: "58",material:{type:'texture',texture: "/images/accessories/58.avif"}   },
  {id: "59", label: "59",material:{type:'texture',texture: "/images/accessories/59.avif"}   }, 
  {id: "102", label: "102",material:{type:'texture',texture: "/images/accessories/102.avif"}},  
  {id: "106", label: "106",material:{type:'texture',texture: "/images/accessories/106.avif"}   }, 
  {id: "107", label: "107",material:{type:'texture',texture: "/images/accessories/107.avif"}  }, 
  {id: "108", label: "108",material:{type:'texture',texture: "/images/accessories/108.avif"} },
];

export const CURATED: CuratedItem[] = [
  { name: "Wolf Gordon — Wood Veneer Jatoba",  brand: "Wolf Gordon",     color: "#8B5A2B" },
  { name: "Everform™ — 102 Arctic",            brand: "Formica",         color: "#D8D4CE" },
  { name: "Pierre Frey — Kyoto 001",           brand: "Pierre Frey",     color: "#A0897A" },
  { name: "Interface — Open Air 404",          brand: "Interface",       color: "#7B8B7A" },
  { name: "Shaw Contract — Pleat Rust 11855",  brand: "Shaw Contract",   color: "#A0422D" },
  { name: "Stark® — Clare Forest",             brand: "Stark",           color: "#4A6B4A" },
];

// export const INITIAL_ITEMS: BoardItem[] = [
//   { id: "init-1",  type: "color",     x: 20,  y: 20,  width: 80,  height: 75,  color: "#1A1E2E" },
//   { id: "init-2",  type: "color",     x: 110, y: 20,  width: 120, height: 75,  color: "#C4622D" },
//   { id: "init-3",  type: "color",     x: 240, y: 20,  width: 100, height: 75,  color: "#D4935A" },
//   { id: "init-4",  type: "color",     x: 20,  y: 105, width: 90,  height: 130, color: "#C9AA72", label: "Rattan cane" },
//   { id: "init-5",  type: "color",     x: 120, y: 105, width: 90,  height: 130, color: "#8B6340", label: "Teak veneer" },
//   { id: "init-6",  type: "color",     x: 220, y: 105, width: 150, height: 65,  color: "#C89B4A", label: "Burnished gold" },
//   { id: "init-7",  type: "color",     x: 220, y: 180, width: 150, height: 55,  color: "#F2E8D9", label: "Warm sand" },
//   { id: "init-8",  type: "color",     x: 380, y: 20,  width: 100, height: 100, color: "#8BA888", label: "Jade ceramic" },
//   { id: "init-9",  type: "color",     x: 490, y: 20,  width: 100, height: 100, color: "#A0C08B", label: "Sage linen" },
//   { id: "init-10", type: "color",     x: 380, y: 130, width: 210, height: 105, color: "#D9C9B0", label: "Linen weave" },
//   { id: "init-11", type: "furniture", x: 605, y: 20,  width: 90,  height: 90,  icon: "🪑", label: "Chair" },
//   { id: "init-12", type: "furniture", x: 705, y: 20,  width: 90,  height: 90,  icon: "🪴", label: "Plant" },
//   { id: "init-13", type: "furniture", x: 605, y: 120, width: 90,  height: 90,  icon: "⚱️", label: "Vase" },
//   { id: "init-14", type: "furniture", x: 705, y: 120, width: 90,  height: 90,  icon: "🍃", label: "Branch" },
//   { id: "init-15", type: "text",      x: 380, y: 250, width: 250, height: 50,  text: "Tangerine Tropics", fontSize: 28, fontStyle: "italic" },
// ];
