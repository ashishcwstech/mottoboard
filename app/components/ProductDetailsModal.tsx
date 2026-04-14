"use client";
import { X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  image: string;
  thumbnails: string[];
  material: string;
  region: string;
  usage: string;
  price: string;
}

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, isOpen, onClose }: Props) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] h-[80%] rounded-lg shadow-lg flex relative">

        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X />
        </button>

        {/* 🖼 LEFT IMAGE */}
        <div className="w-1/3 p-6">
          <img
            src={product.image}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* 📄 CENTER DETAILS */}
        <div className="w-1/3 p-6 overflow-y-auto">
          <h2 className="text-sm text-gray-500 uppercase">
            Wallpaper & Wallcovering
          </h2>

          <h1 className="text-2xl font-semibold mt-2">
            {product.brand}
          </h1>

          <p className="text-gray-500">{product.name}</p>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-4">
            {product.thumbnails.map((t, i) => (
              <img
                key={i}
                src={t}
                className="w-16 h-16 rounded border"
              />
            ))}
          </div>

          {/* Info */}
          <div className="mt-6 space-y-3 text-sm">
            <p><b>Material:</b> {product.material}</p>
            <p><b>Region:</b> {product.region}</p>
            <p><b>Usage:</b> {product.usage}</p>
            <p><b>Price:</b> {product.price}</p>
          </div>
        </div>

        {/* 🧱 RIGHT SIDE (Similar Products) */}
        <div className="w-1/3 p-6 border-l overflow-y-auto">
          <h3 className="text-sm font-semibold mb-4">Similar Products</h3>

          <div className="grid grid-cols-2 gap-4">
            {product.thumbnails.map((img, i) => (
              <div key={i} className="text-xs">
                <img src={img} className="rounded mb-1" />
                <p>Product {i + 1}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}