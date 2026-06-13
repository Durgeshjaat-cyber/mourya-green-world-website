import { Router } from "express";
import { db, plantsTable, categoriesTable, galleryTable, inquiriesTable, activityLogTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router = Router();

router.get("/dashboard/stats", requireAdmin, async (_req, res) => {
  const [plants] = await db.select({ count: count() }).from(plantsTable);
  const [categories] = await db.select({ count: count() }).from(categoriesTable);
  const [gallery] = await db.select({ count: count() }).from(galleryTable);
  const [inquiries] = await db.select({ count: count() }).from(inquiriesTable);
  const [unread] = await db.select({ count: count() }).from(inquiriesTable).where(eq(inquiriesTable.read, false));
  const [featured] = await db.select({ count: count() }).from(plantsTable).where(eq(plantsTable.featured, true));

  res.json({
    totalPlants: plants.count,
    totalCategories: categories.count,
    totalInquiries: inquiries.count,
    unreadInquiries: unread.count,
    totalGalleryImages: gallery.count,
    featuredPlants: featured.count,
  });
});

router.get("/dashboard/recent-activity", requireAdmin, async (_req, res) => {
  const activity = await db.select().from(activityLogTable).orderBy(desc(activityLogTable.createdAt)).limit(20);
  res.json(activity.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })));
});

export default router;
