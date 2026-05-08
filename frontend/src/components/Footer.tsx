import Link from "next/link";
import { BookOpen, Github, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              CollegeHub
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              India's trusted platform to discover, compare, and shortlist colleges for your dream career.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">All Colleges</Link></li>
              <li><Link href="/compare" className="hover:text-blue-600 transition-colors">Compare Colleges</Link></li>
              <li><Link href="/saved" className="hover:text-blue-600 transition-colors">Saved Colleges</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/auth/login" className="hover:text-blue-600 transition-colors">Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-blue-600 transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {year} CollegeHub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={11} className="text-red-400 fill-red-400" /> using Next.js, Express & Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
