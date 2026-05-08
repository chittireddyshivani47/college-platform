"use client";

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { Search, GraduationCap } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import SkeletonCard from "@/components/SkeletonCard";
import CompareBar from "@/components/CompareBar";
import api from "@/lib/api";
import { CollegeFilters, CollegesResponse } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

function buildQuery(filters: CollegeFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.state) params.set("state", filters.state);
  if (filters.minFees !== undefined) params.set("minFees", String(filters.minFees));
  if (filters.maxFees !== undefined) params.set("maxFees", String(filters.maxFees));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.page) params.set("page", String(filters.page));
  params.set("limit", "12");
  return params.toString();
}

export default function HomePage() {
  const [filters, setFilters] = useState<CollegeFilters>({ sortBy: "rating", page: 1 });
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch || undefined, page: 1 }));
  }, [debouncedSearch]);

  const { data, error, isLoading } = useSWR<CollegesResponse>(
    `/api/colleges?${buildQuery(filters)}`,
    fetcher
  );

  const { data: statesData } = useSWR<{ states: string[] }>("/api/colleges/states", fetcher);

  const handleFilterChange = useCallback((update: Partial<CollegeFilters>) => {
    setFilters((f) => ({ ...f, ...update, page: 1 }));
  }, []);

  const handleReset = () => {
    setSearchInput("");
    setFilters({ sortBy: "rating", page: 1 });
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <GraduationCap size={32} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Discover Your Perfect College
          </h1>
          <p className="text-blue-100 text-base mb-8">
            Search, compare, and save from 40+ top colleges across India
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by college name, location…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-60 xl:w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              states={statesData?.states || []}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-600">
                {isLoading ? (
                  <span className="h-4 w-32 bg-gray-200 rounded animate-pulse inline-block" />
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">{data?.pagination.total ?? 0}</span> colleges found
                  </>
                )}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-500 font-medium">Failed to load colleges.</p>
                <p className="text-gray-400 text-sm mt-1">Make sure the backend is running.</p>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                : data?.colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
            </div>

            {/* Empty */}
            {!isLoading && !error && data?.colleges.length === 0 && (
              <div className="text-center py-24">
                <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500">No colleges found</h3>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                <button onClick={handleReset} className="mt-4 btn-outline text-sm">
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {data?.pagination && (
              <Pagination
                pagination={data.pagination}
                onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating compare bar */}
      <CompareBar />
    </>
  );
}
