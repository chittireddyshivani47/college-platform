import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";

export async function compareColleges(ids: string[]) {
  if (ids.length < 2 || ids.length > 3) {
    throw new AppError("Please provide 2 or 3 college IDs to compare", 400);
  }
  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: { courses: true, _count: { select: { courses: true, reviews: true } } },
  });
  if (colleges.length !== ids.length) {
    throw new AppError("One or more colleges not found", 404);
  }
  return ids.map((id) => colleges.find((c) => c.id === id)!);
}
