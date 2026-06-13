import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroBannerUrl: text("hero_banner_url"),
  aboutText: text("about_text"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  address: text("address"),
  service1Title: text("service1_title"),
  service1Desc: text("service1_desc"),
  service2Title: text("service2_title"),
  service2Desc: text("service2_desc"),
  service3Title: text("service3_title"),
  service3Desc: text("service3_desc"),
  service4Title: text("service4_title"),
  service4Desc: text("service4_desc"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true, updatedAt: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
