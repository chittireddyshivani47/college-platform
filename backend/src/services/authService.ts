import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";

export async function register(email: string, name: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already registered", 409);
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, password: hashed },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  return { user, token };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid email or password", 401);
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError("Invalid email or password", 401);
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
}
