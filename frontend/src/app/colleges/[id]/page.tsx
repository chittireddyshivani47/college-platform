"use client";

import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Building2, GitCompare, Globe,
  GraduationCap, Heart, Mail, MapPin, Phone, Star, Users,
} from "lucide-react";
import api from "@/lib/api";
import { CollegeResponse } from "@/types";
import { useCompareStore } from "@/store/compareStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const fetcher = (url: string) => api.get(url).then((r) => r.data);
type Tab = "overview" | "courses" | "placements" | "reviews";

export default function CollegeDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data, error, isLoading } = useSWR<CollegeResponse>(`/api/colleges/${params.id}`, fetcher);
  const { addCollege, removeCollege, isSelected } = useCompareStore();
  const { user } = useAuthStore();
  const college = data?.college;
  const selected = college ? isSelected(college.id) : false;

  const handleCompare = () => {
    if (!college) return;
    if (selected) { removeCollege(college.id); toast.success("Removed from compare"); }
    else { const ok = addCollege(college); ok ? toast.success("Added to compare") : toast.error("Max 3 colleges"); }
  };

  const handleSave = async () => {
    if (!user) { toast.error("Please login to save colleges"); return; }
    if (!college) return;
    setSaving(true);
    try {
      if (saved) { await api.delete(`/api/saved/${college.id}`); setSaved(false); toast.success("Removed from saved"); }
      else { await api.post("/api/saved", { collegeId: college.id }); setSaved(true); toast.success("College saved!"); }
    } catch (e: any) { toast.error(e?.response?.data?.message || "Error"); }
    finally { setSaving(false); }
  };

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse space-y-4">
      <div className="h-64 bg-gray-200 rounded-xl" />
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );

  if (error || !college) return (
    <div className="text-center py-24">
      <p className="text-gray-500">College not found.</p>
      <Link href="/" className="mt-4 inline-block btn-primary text-sm">Go Back</Link>
    </div>
  );

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "courses", label: `Courses (${college._count?.courses ?? 0})` },
    { key: "placements", label: "Placements" },
    { key: "reviews", label: `Reviews (${college._count?.reviews ?? 0})` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} /> Back to Colleges
      </Link>

      {/* Hero */}
      <div className="card overflow-hidden mb-6">
        <div className="relative h-56 sm:h-72">
          <Image src={college.imageUrl} alt={college.name} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 mb-2 inline-block">{college.type} • Est. {college.established}</span>
                <h1 className="text-2xl sm:text-3xl font-bold">{college.name}</h1>
                <div className="flex items-center gap-1.5 mt-1 text-white/80 text-sm">
                  <MapPin size={14} /> {college.location}
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full">
                  <Star size={14} fill="currentColor" />
                  <span className="font-bold text-sm">{college.rating.toFixed(1)}</span>
                </div>
                {college.accreditation && (
                  <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">{college.accreditation}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats + actions */}
        <div className="p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Annual Fees</p>
              <p className="text-lg font-bold text-blue-600">₹{(college.fees / 100000).toFixed(1)}L</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Placement</p>
              <p className="text-lg font-bold text-green-600">{college.placementsPercentage}%</p>
            </div>
            {college.totalStudents && (
              <div className="text-center">
                <p className="text-xs text-gray-500">Students</p>
                <p className="text-lg font-bold text-gray-800">{college.totalStudents.toLocaleString()}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? "bg-red-50 text-red-600 border border-red-200" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              <Heart size={15} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </button>
            <button onClick={handleCompare} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              <GitCompare size={15} />
              {selected ? "In Compare" : "Compare"}
            </button>
            {college.website && (
              <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50">
                <Globe size={15} /> Visit
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === t.key ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-2">About {college.name}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{college.description}</p>
            </div>
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-3">Key Highlights</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <GraduationCap size={16} />, label: "Established", value: college.established },
                  { icon: <Users size={16} />, label: "Total Students", value: college.totalStudents?.toLocaleString() },
                  { icon: <BookOpen size={16} />, label: "Courses Offered", value: college._count?.courses },
                  { icon: <Building2 size={16} />, label: "Accreditation", value: college.accreditation || "N/A" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                    <div className="text-blue-600">{item.icon}</div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{item.value ?? "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-3">Contact Info</h2>
              <div className="space-y-3 text-sm">
                {college.phone && <div className="flex items-center gap-2 text-gray-700"><Phone size={14} className="text-blue-500 shrink-0" />{college.phone}</div>}
                {college.email && <div className="flex items-center gap-2 text-gray-700 break-all"><Mail size={14} className="text-blue-500 shrink-0" />{college.email}</div>}
                {college.website && <div className="flex items-center gap-2"><Globe size={14} className="text-blue-500 shrink-0" /><a href={college.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">{college.website}</a></div>}
                <div className="flex items-start gap-2 text-gray-700"><MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />{college.location}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {college.courses?.map((c) => (
            <div key={c.id} className="card p-4">
              <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>⏱ {c.duration}</span>
                {c.seats && <span>👥 {c.seats} seats</span>}
                <span className="font-semibold text-blue-600">₹{(c.fees / 100000).toFixed(1)}L/yr</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "placements" && (
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Placement Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Placement Rate", value: `${college.placementsPercentage}%`, color: "text-green-600" },
              { label: "Annual Fees", value: `₹${(college.fees / 100000).toFixed(1)}L`, color: "text-blue-600" },
              { label: "Rating", value: `${college.rating}/5`, color: "text-yellow-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>{college.placementsPercentage}%</strong> of students from {college.name} are placed
              in reputed companies. The college has a strong industry network and conducts regular campus recruitment drives.
            </p>
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-4">
          {college.reviews?.length === 0 && (
            <div className="text-center py-12 text-gray-400">No reviews yet.</div>
          )}
          {college.reviews?.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.author}</p>
                  <p className="text-xs text-gray-400">{r.course} {r.batch ? `• Batch ${r.batch}` : ""}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">{r.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
