"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { ArrowLeft, CheckCircle, GitCompare, X, XCircle } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import api from "@/lib/api";
import { College } from "@/types";
import toast from "react-hot-toast";

const fetcher = (url: string, ids: string[]) =>
  api.post(url, { ids }).then((r) => r.data.colleges as College[]);

type Row = { label: string; key: keyof College | "coursesCount"; format?: (v: any) => string };

const COMPARE_ROWS: Row[] = [
  { label: "Location", key: "location" },
  { label: "Type", key: "type" },
  { label: "Established", key: "established" },
  { label: "Accreditation", key: "accreditation" },
  { label: "Annual Fees", key: "fees", format: (v) => `₹${(v / 100000).toFixed(1)}L` },
  { label: "Rating", key: "rating", format: (v) => `${v}/5` },
  { label: "Placements %", key: "placementsPercentage", format: (v) => `${v}%` },
  { label: "Total Students", key: "totalStudents", format: (v) => v?.toLocaleString() ?? "N/A" },
  { label: "Courses Offered", key: "coursesCount" },
];

function getValue(college: College, row: Row): string {
  if (row.key === "coursesCount") return String(college._count?.courses ?? "N/A");
  const val = college[row.key as keyof College];
  if (val === null || val === undefined) return "N/A";
  if (row.format) return row.format(val);
  return String(val);
}

function getBest(colleges: College[], row: Row): string | null {
  if (row.key === "fees") {
    const min = Math.min(...colleges.map((c) => c.fees));
    return colleges.find((c) => c.fees === min)?.id ?? null;
  }
  if (row.key === "rating") {
    const max = Math.max(...colleges.map((c) => c.rating));
    return colleges.find((c) => c.rating === max)?.id ?? null;
  }
  if (row.key === "placementsPercentage") {
    const max = Math.max(...colleges.map((c) => c.placementsPercentage));
    return colleges.find((c) => c.placementsPercentage === max)?.id ?? null;
  }
  if (row.key === "coursesCount") {
    const max = Math.max(...colleges.map((c) => c._count?.courses ?? 0));
    return colleges.find((c) => (c._count?.courses ?? 0) === max)?.id ?? null;
  }
  return null;
}

export default function ComparePage() {
  const { selectedColleges, removeCollege, clearAll } = useCompareStore();
  const ids = selectedColleges.map((c) => c.id);

  const { data: colleges, error, isLoading } = useSWR(
    ids.length >= 2 ? ["/api/compare", ids] : null,
    ([url, ids]) => fetcher(url, ids)
  );

  if (selectedColleges.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <GitCompare size={36} className="text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No colleges selected</h2>
        <p className="text-gray-500 mb-6">Browse colleges and click the compare icon to add them here.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Browse Colleges
        </Link>
      </div>
    );
  }

  if (selectedColleges.length === 1) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">Add at least one more college to compare.</p>
        <Link href="/" className="mt-4 btn-outline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Browse Colleges
        </Link>
      </div>
    );
  }

  const displayColleges = colleges ?? selectedColleges;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-2">
            <ArrowLeft size={15} /> Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Compare Colleges</h1>
          <p className="text-gray-500 text-sm mt-0.5">Side-by-side comparison of {selectedColleges.length} colleges</p>
        </div>
        <button onClick={clearAll} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50">
          <X size={15} /> Clear All
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-20 text-gray-400 animate-pulse">Loading comparison…</div>
      )}

      {error && (
        <div className="text-center py-20 text-red-500">Failed to load comparison data.</div>
      )}

      {!isLoading && displayColleges && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full min-w-[600px] bg-white">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-36">
                  Feature
                </th>
                {displayColleges.map((college) => (
                  <th key={college.id} className="px-4 py-3 text-center">
                    <div className="relative">
                      <button
                        onClick={() => removeCollege(college.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={11} />
                      </button>
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-gray-100">
                        <Image src={college.imageUrl} alt={college.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <Link href={`/colleges/${college.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 leading-tight">
                        {college.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, rowIdx) => {
                const bestId = getBest(displayColleges, row);
                return (
                  <tr key={row.key} className={rowIdx % 2 === 0 ? "bg-gray-50/50" : "bg-white"}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-600">{row.label}</td>
                    {displayColleges.map((college) => {
                      const val = getValue(college, row);
                      const isBest = bestId === college.id;
                      return (
                        <td key={college.id} className="px-4 py-3 text-center">
                          <span className={`text-sm font-semibold inline-flex items-center justify-center gap-1 ${isBest ? "text-green-600" : "text-gray-800"}`}>
                            {isBest && <CheckCircle size={13} className="text-green-500" />}
                            {val}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
