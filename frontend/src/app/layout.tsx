import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SWRProvider } from "@/components/SWRProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollegeHub – Discover Your Perfect College",
  description: "Search, compare, and save colleges across India. Find the best fit for your future.",
  keywords: ["college", "university", "admission", "India", "engineering", "MBA"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <SWRProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: "8px", fontFamily: inter.style.fontFamily },
            }}
          />
        </SWRProvider>
      </body>
    </html>
  );
}
