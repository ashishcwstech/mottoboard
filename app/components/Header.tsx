"use client";
import { useState } from "react";

interface Props {
  onAddText: () => void;
  onClear: () => void;
}

export default function Header({ onAddText, onClear }: Props) {
  const [title, setTitle] = useState("Tangerine Tropics");

  return (
    <header className="flex items-center justify-between px-7 py-3.5 border-b border-sand-200 bg-sand-50 sticky top-0 z-50">
      <span className="font-display text-xl font-light tracking-widest text-sand-500">MattoBoard</span>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-display text-[22px] italic tracking-wide text-sand-900 bg-transparent
          border-b border-dashed border-sand-200 focus:border-sand-500 focus:outline-none
          px-2 py-0.5 text-center min-w-[200px]"
      />

      <div className="flex gap-2.5 items-center">
        <button
          onClick={onClear}
          className="text-[11px] font-mono px-4 py-1.5 rounded-sm border border-sand-200
            text-sand-400 hover:bg-sand-100 hover:text-sand-700 transition-all duration-150"
        >
          Clear
        </button>
        <button
          onClick={onAddText}
          className="text-[11px] font-mono px-4 py-1.5 rounded-sm border border-sand-200
            text-sand-400 hover:bg-sand-100 hover:text-sand-700 transition-all duration-150"
        >
          + Text
        </button>
        <button
          onClick={() => window.print()}
          className="text-[11px] font-mono px-4 py-1.5 rounded-sm
            bg-sand-500 text-sand-50 hover:bg-sand-600 transition-colors duration-150"
        >
          Export
        </button>
      </div>
    </header>
  );
}
