import Link from "next/link";
import { GraduationCap, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="text-center">
        {/* 404 graphic */}
        <div className="relative inline-block mb-8">
          <div className="text-[120px] font-black text-blue-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap size={40} className="text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <Link href="/compare" className="btn-outline inline-flex items-center justify-center gap-2">
            Compare Colleges
          </Link>
        </div>
      </div>
    </div>
  );
}
