"use client";

import Image from "next/image";
import Link from "next/link";
import { GitCompare, Heart, MapPin, Star, Users } from "lucide-react";
import { College } from "@/types";
import { useCompareStore } from "@/store/compareStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useState } from "react";

interface Props {
  college: College;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export default function CollegeCard({ college, isSaved = false, onSaveToggle }: Props) {
  const { addCollege, removeCollege, isSelected } = useCompareStore();
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const selected = isSelected(college.id);

  const handleCompare = () => {
    if (selected) {
      removeCollege(college.id);
      toast.success(`Removed from compare`);
    } else {
      const added = addCollege(college);
      if (!added) toast.error("You can compare max 3 colleges");
      else toast.success(`Added to compare`);
    }
  };

  const handleSave = async () => {
    if (!user) { toast.error("Please login to save colleges"); return; }
    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/api/saved/${college.id}`);
        toast.success("Removed from saved");
      } else {
        await api.post("/api/saved", { collegeId: college.id });
        toast.success("College saved!");
      }
      onSaveToggle?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card hover:shadow-md transition-all duration-200 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <Image
          src={college.imageUrl}
          alt={college.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            title={isSaved ? "Remove from saved" : "Save college"}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
              isSaved ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart size={15} fill={isSaved ? "currentColor" : "none"} />
          </button>
          {/* Compare button */}
          <button
            onClick={handleCompare}
            title={selected ? "Remove from compare" : "Add to compare"}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
              selected ? "bg-blue-600 text-white" : "bg-white/80 text-gray-600 hover:text-blue-600"
            }`}
          >
            <GitCompare size={15} />
          </button>
        </div>
        {/* Type badge */}
        <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold text-gray-700 px-2 py-0.5 rounded-full">
          {college.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/colleges/${college.id}`}>
          <h3 className="font-bold text-gray-900 text-base leading-tight hover:text-blue-600 transition-colors line-clamp-1">
            {college.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
          <MapPin size={12} />
          <span className="truncate">{college.location}</span>
        </div>

        <p className="mt-2 text-gray-500 text-xs line-clamp-2">{college.description}</p>

        {/* Stats row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">{college.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={12} />
            <span>{college.placementsPercentage}% placed</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Annual Fees</p>
            <p className="text-sm font-bold text-blue-600">
              ₹{(college.fees / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/colleges/${college.id}`}
          className="mt-3 block text-center btn-primary text-sm py-1.5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
