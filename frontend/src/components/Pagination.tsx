"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination as PaginationType } from "@/types";

interface Props {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: Props) {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  // Insert ellipsis
  const withEllipsis: (number | "...")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(p);
  });

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {withEllipsis.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-blue-600 text-white"
                : "border border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
