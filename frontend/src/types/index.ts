// ─── College ──────────────────────────────────────────────────────────────────
export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  seats: number | null;
  collegeId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  batch: string | null;
  course: string | null;
  createdAt: string;
  collegeId: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  placementsPercentage: number;
  description: string;
  imageUrl: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  established: number | null;
  totalStudents: number | null;
  accreditation: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
  reviews?: Review[];
  _count?: { courses: number; reviews: number };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CollegesResponse {
  success: boolean;
  colleges: College[];
  pagination: Pagination;
}

export interface CollegeResponse {
  success: boolean;
  college: College;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  createdAt: string;
  college: College;
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface CollegeFilters {
  search?: string;
  state?: string;
  minFees?: number;
  maxFees?: number;
  sortBy?: "rating" | "fees_asc" | "fees_desc" | "name";
  page?: number;
  limit?: number;
}
