import { Router } from "express";
import { db, galleryTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { AddGalleryImageBody, DeleteGalleryImageParams } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { logActivity } from "../lib/activity";

const router = Router();

router.get("/gallery", async (_req, res) => {
  const rows = await db.select().from(galleryTable).orderBy(desc(galleryTable.createdAt));
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/gallery", requireAdmin, async (req, res) => {
  const parsed = AddGalleryImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [row] = await db.insert(galleryTable).values(parsed.data).returning();
  await logActivity("gallery", `Added gallery image`);
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/gallery/:id", requireAdmin, async (req, res) => {
  const parsed = DeleteGalleryImageParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.delete(galleryTable).where(eq(galleryTable.id, parsed.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await logActivity("gallery", `Deleted gallery image`);
  res.json({ message: "Deleted" });
});

export default router;
