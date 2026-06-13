import { Router } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  SubmitInquiryBody,
  UpdateInquiryBody,
  UpdateInquiryParams,
  DeleteInquiryParams,
  ListInquiriesQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { logActivity } from "../lib/activity";

const router = Router();

router.get("/inquiries", requireAdmin, async (req, res) => {
  const parsed = ListInquiriesQueryParams.safeParse({
    read: req.query.read !== undefined ? req.query.read === "true" : undefined,
  });

  let rows;
  if (parsed.success && parsed.data.read !== undefined) {
    rows = await db.select().from(inquiriesTable).where(eq(inquiriesTable.read, parsed.data.read)).orderBy(desc(inquiriesTable.createdAt));
  } else {
    rows = await db.select().from(inquiriesTable).orderBy(desc(inquiriesTable.createdAt));
  }
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/inquiries", async (req, res) => {
  const parsed = SubmitInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [row] = await db.insert(inquiriesTable).values({ ...parsed.data, read: false }).returning();
  await logActivity("inquiry", `New inquiry from ${row.name}`);
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/inquiries/:id", requireAdmin, async (req, res) => {
  const paramParsed = UpdateInquiryParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateInquiryBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [row] = await db.update(inquiriesTable).set(bodyParsed.data).where(eq(inquiriesTable.id, paramParsed.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/inquiries/:id", requireAdmin, async (req, res) => {
  const parsed = DeleteInquiryParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.delete(inquiriesTable).where(eq(inquiriesTable.id, parsed.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await logActivity("inquiry", `Deleted inquiry from ${row.name}`);
  res.json({ message: "Deleted" });
});

export default router;
