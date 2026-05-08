"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, Bookmark, GraduationCap } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import CollegeCard from "@/components/CollegeCard";
import SkeletonCard from "@/components/SkeletonCard";
import { SavedCollege } from "@/types";
import CompareBar from "@/components/CompareBar";

const fetcher = (url: string) => api.get(url).then((r) => r.data.saved as SavedCollege[]);

export default function SavedPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  const { data: saved, isLoading, mutate } = useSWR(
    user ? "/api/saved" : null,
    fetcher
  );

  if (authLoading || !user) return null;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6">
          <ArrowLeft size={15} /> Back to Colleges
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Bookmark size={20} className="text-red-500 fill-red-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Colleges</h1>
            <p className="text-gray-500 text-sm">
              {saved ? `${saved.length} college${saved.length !== 1 ? "s" : ""} saved` : ""}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!isLoading && saved?.length === 0 && (
          <div className="text-center py-24">
            <GraduationCap size={52} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No saved colleges yet</h3>
            <p className="text-gray-400 text-sm mt-1">Browse colleges and click ❤️ to save them here</p>
            <Link href="/" className="mt-5 inline-block btn-primary text-sm">
              Browse Colleges
            </Link>
          </div>
        )}

        {!isLoading && saved && saved.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {saved.map((sc) => (
              <CollegeCard
                key={sc.id}
                college={sc.college}
                isSaved={true}
                onSaveToggle={() => mutate()}
              />
            ))}
          </div>
        )}
      </div>
      <CompareBar />
    </>
  );
}
