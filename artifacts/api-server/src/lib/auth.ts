import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const session = req.session as any;
  if (!session?.adminId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
