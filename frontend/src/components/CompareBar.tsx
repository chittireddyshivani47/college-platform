"use client";

import Link from "next/link";
import Image from "next/image";
import { X, GitCompare } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

export default function CompareBar() {
  const { selectedColleges, removeCollege, clearAll } = useCompareStore();

  if (selectedColleges.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto flex-1 min-w-0">
          {selectedColleges.map((c) => (
            <div key={c.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 shrink-0">
              <div className="relative w-6 h-6 rounded overflow-hidden">
                <Image src={c.imageUrl} alt={c.name} fill className="object-cover" sizes="24px" />
              </div>
              <span className="text-xs font-medium text-gray-800 max-w-28 truncate">{c.name}</span>
              <button onClick={() => removeCollege(c.id)} className="text-gray-400 hover:text-red-500 ml-1">
                <X size={13} />
              </button>
            </div>
          ))}
          {selectedColleges.length < 3 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-400 shrink-0">
              + Add college
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={clearAll} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5">
            Clear all
          </button>
          <Link href="/compare" className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
            <GitCompare size={15} />
            Compare ({selectedColleges.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
