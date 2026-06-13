import { Router } from "express";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AdminLoginBody, ChangeAdminPasswordBody } from "@workspace/api-zod";
import { hashPassword, verifyPassword, requireAdmin } from "../lib/auth";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;
  const [admin] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email));
  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  (req.session as any).adminId = admin.id;
  res.json({ message: "Logged in", admin: { id: admin.id, email: admin.email } });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

router.get("/auth/me", requireAdmin, async (req, res) => {
  const adminId = (req.session as any).adminId;
  const [admin] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, adminId));
  if (!admin) {
    res.status(401).json({ error: "Not found" });
    return;
  }
  res.json({ id: admin.id, email: admin.email });
});

router.post("/auth/change-password", requireAdmin, async (req, res) => {
  const parsed = ChangeAdminPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { currentPassword, newPassword } = parsed.data;
  const adminId = (req.session as any).adminId;
  const [admin] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, adminId));
  if (!admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const valid = await verifyPassword(currentPassword, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }
  const newHash = await hashPassword(newPassword);
  await db.update(adminUsersTable).set({ passwordHash: newHash }).where(eq(adminUsersTable.id, adminId));
  res.json({ message: "Password changed successfully" });
});

export default router;
