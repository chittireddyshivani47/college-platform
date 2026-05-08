"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { CollegeFilters } from "@/types";

interface Props {
  filters: CollegeFilters;
  states: string[];
  onChange: (f: Partial<CollegeFilters>) => void;
  onReset: () => void;
}

const FEE_RANGES = [
  { label: "All Fees", min: undefined, max: undefined },
  { label: "Under ₹1L", min: 0, max: 100000 },
  { label: "₹1L – ₹3L", min: 100000, max: 300000 },
  { label: "₹3L – ₹5L", min: 300000, max: 500000 },
  { label: "₹5L – ₹10L", min: 500000, max: 1000000 },
  { label: "Above ₹10L", min: 1000000, max: undefined },
];

export default function FilterSidebar({ filters, states, onChange, onReset }: Props) {
  const activeFiltersCount = [filters.state, filters.minFees, filters.sortBy].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-20 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button onClick={onReset} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
            <X size={12} /> Reset
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="mb-5">
        <label className="label">Sort By</label>
        <select
          value={filters.sortBy || "rating"}
          onChange={(e) => onChange({ sortBy: e.target.value as CollegeFilters["sortBy"] })}
          className="input text-sm"
        >
          <option value="rating">Highest Rating</option>
          <option value="fees_asc">Lowest Fees</option>
          <option value="fees_desc">Highest Fees</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* State */}
      <div className="mb-5">
        <label className="label">State / Location</label>
        <select
          value={filters.state || ""}
          onChange={(e) => onChange({ state: e.target.value || undefined })}
          className="input text-sm"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Fees */}
      <div className="mb-2">
        <label className="label">Fees Range</label>
        <div className="space-y-1.5">
          {FEE_RANGES.map((range) => {
            const isActive = filters.minFees === range.min && filters.maxFees === range.max;
            return (
              <button
                key={range.label}
                onClick={() => onChange({ minFees: range.min, maxFees: range.max })}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium border border-blue-200"
                    : "hover:bg-gray-50 text-gray-700 border border-transparent"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
