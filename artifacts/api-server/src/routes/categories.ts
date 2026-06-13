import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateCategoryBody, UpdateCategoryBody, GetCategoryParams, UpdateCategoryParams, DeleteCategoryParams } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { logActivity } from "../lib/activity";

const router = Router();

router.get("/categories", async (_req, res) => {
  const rows = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/categories", requireAdmin, async (req, res) => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [row] = await db.insert(categoriesTable).values(parsed.data).returning();
  await logActivity("category", `Created category: ${row.name}`);
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.get("/categories/:id", async (req, res) => {
  const parsed = GetCategoryParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, parsed.data.id));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/categories/:id", requireAdmin, async (req, res) => {
  const paramParsed = UpdateCategoryParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateCategoryBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [row] = await db.update(categoriesTable).set(bodyParsed.data).where(eq(categoriesTable.id, paramParsed.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await logActivity("category", `Updated category: ${row.name}`);
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/categories/:id", requireAdmin, async (req, res) => {
  const parsed = DeleteCategoryParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.delete(categoriesTable).where(eq(categoriesTable.id, parsed.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await logActivity("category", `Deleted category: ${row.name}`);
  res.json({ message: "Deleted" });
});

export default router;
