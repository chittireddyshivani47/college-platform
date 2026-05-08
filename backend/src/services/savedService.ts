import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";

export async function getSaved(userId: string) {
  return prisma.savedCollege.findMany({
    where: { userId },
    include: { college: { include: { _count: { select: { courses: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function saveCollege(userId: string, collegeId: string) {
  const college = await prisma.college.findUnique({ where: { id: collegeId } });
  if (!college) throw new AppError("College not found", 404);
  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });
  if (existing) throw new AppError("College already saved", 409);
  return prisma.savedCollege.create({
    data: { userId, collegeId },
    include: { college: true },
  });
}

export async function removeCollege(userId: string, collegeId: string) {
  const record = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });
  if (!record) throw new AppError("Saved college not found", 404);
  await prisma.savedCollege.delete({
    where: { userId_collegeId: { userId, collegeId } },
  });
  return { message: "College removed from saved" };
}
