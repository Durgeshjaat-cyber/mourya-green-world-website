import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { UpdateSiteSettingsBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { logActivity } from "../lib/activity";

const router = Router();

async function getOrCreateSettings() {
  const rows = await db.select().from(siteSettingsTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [row] = await db.insert(siteSettingsTable).values({
    heroTitle: "Welcome to Mourya Green World",
    heroSubtitle: "Your trusted plant nursery for premium quality plants and gardening services",
    aboutText: "Mourya Green World is a family-owned plant nursery dedicated to bringing nature's beauty to your home and garden. We specialize in a wide variety of indoor and outdoor plants, offering expert care advice and premium quality plants at affordable prices.",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "info@mouryagreenworld.com",
    address: "123 Garden Lane, Green Nagar, Hyderabad, Telangana 500001",
    service1Title: "Premium Plants",
    service1Desc: "Carefully sourced and nurtured plants from trusted growers for your garden.",
    service2Title: "Expert Consultation",
    service2Desc: "Get personalized advice on plant care, landscaping, and garden design.",
    service3Title: "Home Delivery",
    service3Desc: "We deliver your plants safely to your doorstep across the city.",
    service4Title: "Landscape Design",
    service4Desc: "Transform your space with our professional landscape design services.",
  }).returning();
  return row;
}

router.get("/site-settings", async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ ...settings, updatedAt: settings.updatedAt.toISOString() });
});

router.patch("/site-settings", requireAdmin, async (req, res) => {
  const parsed = UpdateSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  await getOrCreateSettings();
  const [row] = await db.update(siteSettingsTable).set({ ...parsed.data, updatedAt: new Date() }).returning();
  await logActivity("settings", "Updated site settings");
  res.json({ ...row, updatedAt: row.updatedAt.toISOString() });
});

export default router;
