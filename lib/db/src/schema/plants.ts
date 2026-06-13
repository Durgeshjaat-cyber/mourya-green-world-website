import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const plantsTable = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  imageUrl: text("image_url"),
  categoryId: integer("category_id"),
  featured: boolean("featured").default(false).notNull(),
  careInstructions: text("care_instructions"),
  sunlight: text("sunlight"),
  water: text("water"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlantSchema = createInsertSchema(plantsTable).omit({ id: true, createdAt: true });
export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type Plant = typeof plantsTable.$inferSelect;
