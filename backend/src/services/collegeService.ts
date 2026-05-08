import { prisma } from "../utils/prisma";

interface CollegeFilters {
  search?: string;
  state?: string;
  minFees?: number;
  maxFees?: number;
  sortBy?: "rating" | "fees_asc" | "fees_desc" | "name";
  page?: number;
  limit?: number;
}

export async function getColleges(filters: CollegeFilters) {
  const { search, state, minFees, maxFees, sortBy = "rating", page = 1, limit = 12 } = filters;
  const skip = (page - 1) * limit;
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (state) where.state = { contains: state, mode: "insensitive" };
  if (minFees !== undefined || maxFees !== undefined) {
    where.fees = {};
    if (minFees !== undefined) where.fees.gte = minFees;
    if (maxFees !== undefined) where.fees.lte = maxFees;
  }
  const orderBy: any =
    sortBy === "fees_asc" ? { fees: "asc" } :
    sortBy === "fees_desc" ? { fees: "desc" } :
    sortBy === "name" ? { name: "asc" } :
    { rating: "desc" };
  const [total, colleges] = await Promise.all([
    prisma.college.count({ where }),
    prisma.college.findMany({
      where, orderBy, skip, take: limit,
      include: { _count: { select: { courses: true, reviews: true } } },
    }),
  ]);
  return {
    colleges,
    pagination: {
      total, page, limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

export async function getCollegeById(id: string) {
  return prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      reviews: { orderBy: { createdAt: "desc" } },
      _count: { select: { courses: true, reviews: true } },
    },
  });
}

export async function getStates() {
  const states = await prisma.college.findMany({
    select: { state: true },
    distinct: ["state"],
    orderBy: { state: "asc" },
  });
  return states.map((s) => s.state);
}
