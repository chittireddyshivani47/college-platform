"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, GitCompare, Heart, LogIn, LogOut, Menu, User, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCompareStore } from "@/store/compareStore";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initAuth } = useAuthStore();
  const { selectedColleges } = useCompareStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { initAuth(); }, [initAuth]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Colleges", icon: <BookOpen size={16} /> },
    { href: "/compare", label: `Compare${selectedColleges.length > 0 ? ` (${selectedColleges.length})` : ""}`, icon: <GitCompare size={16} /> },
    ...(user ? [{ href: "/saved", label: "Saved", icon: <Heart size={16} /> }] : []),
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span>CollegeHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <span className="font-medium">{user.name.split(" ")[0]}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="btn-outline text-sm py-1.5 px-3 flex items-center gap-1.5">
                  <LogIn size={16} /> Login
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm py-1.5 px-3">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                pathname === link.href ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2">
            {user ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full">
                <LogOut size={16} /> Logout ({user.name})
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm text-center">Login</Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
