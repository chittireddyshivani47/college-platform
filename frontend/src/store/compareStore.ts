import { create } from "zustand";
import { persist } from "zustand/middleware";
import { College } from "@/types";

interface CompareState {
  selectedColleges: College[];
  addCollege: (college: College) => boolean; // returns false if limit reached
  removeCollege: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedColleges: [],

      addCollege: (college) => {
        const { selectedColleges } = get();
        if (selectedColleges.length >= 3) return false;
        if (selectedColleges.find((c) => c.id === college.id)) return true;
        set({ selectedColleges: [...selectedColleges, college] });
        return true;
      },

      removeCollege: (id) => {
        set((state) => ({
          selectedColleges: state.selectedColleges.filter((c) => c.id !== id),
        }));
      },

      clearAll: () => set({ selectedColleges: [] }),

      isSelected: (id) => get().selectedColleges.some((c) => c.id === id),
    }),
    { name: "compare-store" }
  )
);
